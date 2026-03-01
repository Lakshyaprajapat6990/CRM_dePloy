import { Box, colors, Modal, styled, TextField } from "@mui/material";

const fontSize = {
  h1: "3rem",
  h2: "2.25rem", //36px
  h3: "1.875rem", //30px
  h24: "1.5rem", //24px
  h4: "1.25rem", //20px
  h18: "1.125rem", //18px
  h5: "1rem", //16px
  h6: "0.9rem", //14px
  h7: "0.8rem", //12px
  p: "0.75rem",
};
const fontWeight = {
  extrabold: 800,
  bold: 700,
  semibold: 600,
  medium: 500,
  p1: 400,
};

const GlobalCssStyles = styled(Box)({
  "& .parent-container": {
    marginTop:'5%'
  },
  "& .heading-container": {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingBottom: "1%",
  },

  "& .heading-text": {
    fontSize: "1.5rem",
    fontWeight: 600,
    paddingBottom: "1%",
    fontFamily: "Poppins",
  },

  "& .create-btn": {
    marginTop: "10px",
    borderRadius: "20px",
    width: "fit-content",
    height: "3rem",
    lineHeight: "10px",
    textTransform: "none",
    padding: "0px 2%",
    fontWeight:500,
    fontFamily:'Poppins',
    // backgroundColor: "#e59419",
    backgroundColor: "#9a67e6",
    opacity: "70%",
    color: "white",
    "&:hover": {
      opacity: "100%",
    },
    "&:disabled": {
      backgroundColor: "#C3C3C3",
      fontWeight: 600,
    },
  },
  "& .policies-text": {
    fontSize: fontSize.h24,
    fontWeight: fontWeight.semibold,
    paddingBottom: "1%",
    fontFamily: "Poppins",
  },
});

const CustomeModal = styled(Modal)({
  "& ": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  "& .modal-container": {
    width: "40%",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    borderRadius: "10px",
    bgcolor: "white",
    border: "1px solid #01D9D1",
    boxShadow: "md",
    padding: "2%",
  },
  "& .modal-header": {
    flexShrink: 0,
    padding: "1%",
    paddingBottom: "5%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  "& .modal-body": {
    flexGrow: 1,
    overflowY: "auto",
    maxHeight: "60vh",
    padding: "1%",
  },
  "& .modal-footer": {
    flexShrink: 0,
    padding: "1%",
    display: "flex",
    justifyContent: "flex-start",
    gap: "1rem",
  },
  "& .control-mapping-container": {
    width: "40%",
    padding: "2%",
    boxShadow: "md",
    border: "1px solid #01D9D1",
    marginBottom: "1%",
    maxHeight: "92vh",
    overflowY: "auto",
    borderRadius: "20px",
  },
  "& .control-mapping-container-extra-width": {
    width: "40%",
    padding: "2%",
    boxShadow: "md",
    border: "1px solid #01D9D1",
    marginBottom: "1%",
    maxHeight: "92vh",
    overflowY: "auto",
    borderRadius: "20px",
  },
  "& .modal-container-style": {
    width: "40%",
    padding: "2%",
    boxShadow: "md",
    border: "1px solid #01D9D1",
    borderRadius: "20px",
    backgroundColor: "white",
  },
  "& .compare-doc-modal-style": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "92vh",
    marginTop: "8vh",
    borderRadius: "20px",
  },
  "& .create-control-modal-container": {
    padding: "2%",
    boxShadow: "md",
    border: "1px solid #01D9D1",
    borderRadius: "20px",
    backgroundColor: "white",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  "& .objective-modal-container": {
    width: "40%",
    padding: "2%",
    boxShadow: "md",
    border: "1px solid #01D9D1",
    borderRadius: "1rem",
  },
  "& .delete-modal-container": {
    padding: "2%",
    width: "30%",
    boxShadow: "md",
    border: "1px solid #01D9D1",
    borderRadius: "20px",
    backgroundColor: "white",
    maxHeight: "85vh",
  },
  "& .download-modal-container": {
    padding: "2%",
    width: "30%",
    boxShadow: "md",
    border: "1px solid #01D9D1",
    borderRadius: "20px",
    backgroundColor: "white",
    maxHeight: "85vh",
  },
  "& .kpi-modal-container": {
    width: "40%",
    height: "85vh",
    padding: "2%",
    boxShadow: "md",
    borderRadius: "0.8rem",
    border: "1px solid #01D9D1",
    // "&::-webkit-scrollbar": {
    //   width: "1rem",
    // },
    // "&::-webkit-scrollbar-thumb": {
    //   backgroundColor: "#888888",
    //   borderRadius: "1rem",
    //   opacity: 90
    // },
    // "&::-webkit-scrollbar-thumb:hover": {
    //   backgroundColor: "#555",
    // },
    // "&::-webkit-scrollbar-track": {
    //   background: "#f1f1f1",
    // },  },
  },

  "& .create-modal-heading": {
    fontSize: "1.25rem",
    fontFamily: "Poppins",
    fontWeight: 600,
    textAlign: "Left",
  },
});

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.5rem",
    borderColor: "rgba(0, 0, 0, 0.23)",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },
    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "black !important",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "16px",
        width:'100%',

    fontWeight: "500",
    fontFamily: "Poppins, sans-serif",
    "&::placeholder": {
      fontWeight: 500,
      fontFamily: "Poppins",
      opacity: 0.5,
    },
  },
  "& .MuiFormHelperText-root": {
    color: "black",
  },
}));

export { CustomeModal, GlobalCssStyles, fontSize, fontWeight, CustomTextField };
