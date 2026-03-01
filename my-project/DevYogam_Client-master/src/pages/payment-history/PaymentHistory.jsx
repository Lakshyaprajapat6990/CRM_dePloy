import React, { useEffect, useState } from "react";
import { GetPaymentHistoryAPI } from "../../services/GetPaymentHistoryAPI";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Box,
  Button,
  Modal,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";
import { GlobalCssStyles } from "../../style/GlobalCSS";
import Pixel from "../pixel/Pixel";
const getPoojaPackageType = (participants = []) => {
  if (participants.length === 1) return "Single";
  if (participants.length === 2) return "Couple";
  if (participants.length > 2) return "Family";
  return "-";
};

export default function PaymentHistory() {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const getPaymentHistory = async () => {
    const res = await GetPaymentHistoryAPI();
    setPaymentHistory(res || []);
  };
  useEffect(() => {
    getPaymentHistory();
  }, []);

  const columns = [
    { field: "mobile", headerName: "Mobile No.", width: 130 },
    { field: "status", headerName: "Payment Status", width: 130 },
    { field: "poojaTitle", headerName: "Pooja Title", width: 200 },
    { field: "poojaPrice", headerName: "Pooja Price (₹)", width: 130 },
    { field: "poojaPkg", headerName: "Pooja Package Type", width: 160 },
    {
      field: "poojaDate",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => (
        <Box className="title-style">
          {!params?.row?.editable && (
            <Box className="datagrid-column-title">
              <span
                // onClick={() => handleRowClicked(params?.row?._id)}
                className="table-row-hover"
              >
                {params?.row?.poojaDate ? params?.row?.poojaDate : "N/A"}
              </span>
            </Box>
          )}
        </Box>
      ),
      // valueFormatter: (params) => {
      //   if (!params.value) return "-";
      //   return dayjs(params.value, "DD-MM-YYYY").format("DD/MM/YYYY");
      // },
    },
  ];

  const dataRows = paymentHistory.map((item, index) => ({
    id: item._id,
    mobile: item.mobile || "-",
    status: item.status || "-",
    poojaTitle: item.pooja?.title || "-",
    poojaPrice: item.amount ?? "-",
    poojaPkg: getPoojaPackageType(item.participants),
    poojaDate: item.createdAt || "-",
    participants: item.participants || [],
  }));

  // Modal handler
  const handleRowClick = (params) => {
    setSelectedParticipants(params.row.participants || []);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedParticipants([]);
  };

  return (
    <GlobalCssStyles>
      <Box sx={{ minHeight: "80vh" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "90%",
            margin: "auto",
            pt: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              mb: 4,
              fontWeight: 500,
              fontFamily: "Poppins",
            }}
          >
            Payment History
          </Typography>
          <Button className="create-btn" onClick={getPaymentHistory}>
            Refresh
          </Button>
        </Box>
        <Box sx={{ width: "90%", margin: "auto" }}>
          <DataGrid
            rows={dataRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            onRowClick={handleRowClick}
            autoHeight
          />
        </Box>

        <Modal
          open={modalOpen}
          onClose={handleClose}
          aria-labelledby="participant-modal-title"
        >
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: 4,
              minWidth: 320,
              boxShadow: 24,
              fontFamily: "Poppins",
            }}
          >
            <Typography
              id="participant-modal-title"
              variant="h6"
              sx={{ mb: 2, fontWeight: 500 }}
            >
              Participant Details
            </Typography>
            {selectedParticipants.length ? (
              <List>
                {selectedParticipants.map((p, i) => (
                  <React.Fragment key={p._id || i}>
                    <ListItem>
                      <ListItemText
                        primary={p.username || "Name not available"}
                        secondary={`Gotra: ${p.gotra || "Kashyap"}`}
                      />
                    </ListItem>
                    {i !== selectedParticipants.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography>No participants found.</Typography>
            )}
            <Box sx={{ textAlign: "right", mt: 2 }}>
              <Button onClick={handleClose} variant="contained">
                Close
              </Button>
            </Box>
          </Paper>
        </Modal>
      </Box>
    </GlobalCssStyles>
  );
}
