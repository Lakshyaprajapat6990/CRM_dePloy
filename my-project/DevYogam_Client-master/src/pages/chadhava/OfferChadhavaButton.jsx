import React, { useState } from "react";
import {
  Button,
  Box,
  Modal,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  fontFamily: "'Poppins', sans-serif",
};

export default function OfferChadhavaButton({ language, amount, poojaId, buttonStyle }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [gotra, setGotra] = useState("");
  const [isKashyapChecked, setIsKashyapChecked] = useState(false);

  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleKashyapChange = (event) => {
    setIsKashyapChecked(event.target.checked);
    if (event.target.checked) {
      setGotra("Kashyap");
    } else {
      setGotra("");
    }
  };

  const isOfferDisabled =
    !name.trim() || !number.trim() || (!gotra.trim() && !isKashyapChecked);

  // On form submit: navigate to RazorpayCheckout page, passing required data in location.state
  const handleOfferChadhava = () => {
    const participants = [{ username: name, gotra }];
    const mobile = number; // assuming number is mobile

    navigate("/razorpay", {
      state: {
        amount,
        participants,
        username: name,
        userGotra: gotra,
        mobile,
        id: poojaId,
      },
    });
    handleClose();
  };

  return (
    <>
      <Button variant="contained" sx={{ ...buttonStyle }} onClick={handleOpen}>
        {language === "hi" ? "चढ़ावा अर्पित करें" : "Offer Chadhava"}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="offer-chadhava-modal-title"
        aria-describedby="offer-chadhava-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="offer-chadhava-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}
          >
            {language === "hi" ? "चढ़ावा विवरण भरें" : "Fill Chadhava Details"}
          </Typography>
          <TextField
            fullWidth
            label={language === "hi" ? "मोबाइल नंबर" : "Mobile Number"}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            inputProps={{ maxLength: 10, inputMode: "numeric" }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={language === "hi" ? "नाम" : "Name"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={language === "hi" ? "गोत्र" : "Gotra"}
            value={gotra}
            onChange={(e) => setGotra(e.target.value)}
            disabled={isKashyapChecked}
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isKashyapChecked}
                onChange={handleKashyapChange}
              />
            }
            label={
              language === "hi"
                ? "गोत्र की जानकारी नहीं है"
                : "Don't know Gotra"
            }
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleOfferChadhava}
            disabled={isOfferDisabled}
            sx={{
              bgcolor: "#89255b",
              color: "#fff",
              fontWeight: 700,
              fontFamily: "'Poppins', sans-serif",
              "&:hover": {
                bgcolor: "#7323d3",
              },
            }}
          >
            {language === "hi" ? "चढ़ावा अर्पित करें" : "Offer Chadhava"}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
