import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Snackbar,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { GetPoojaByID } from "../../services/GetPoojaByID";
import { useNavigate, useParams } from "react-router-dom";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { LanguageContext } from "../../context/LanguageContext";

export default function PujaBookingPage() {
  const { language } = useContext(LanguageContext);
  const [mobile, setMobile] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { id, type } = useParams();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dontKnowGotra, setDontKnowGotra] = useState(false);
  const [poojaData, setPoojaData] = useState(null);

  const getInitialParticipants = () => {
    let count = 1;
    if (type === "couple") count = 2;
    else if (type === "family") count = 4;
    return Array(count)
      .fill()
      .map(() => ({
        username: "",
        gotra: "",
        noGotra: false,
      }));
  };

  const navigate = useNavigate();
  const [participants, setParticipants] = useState(getInitialParticipants());

  useEffect(() => {
    const getPooja = async () => {
      const res = await GetPoojaByID(id);
      setPoojaData(res);
    };
    getPooja();
  }, [id]);

  useEffect(() => {
    setParticipants(getInitialParticipants());
  }, [type]);

  const isMobileValid = /^\d{10}$/.test(mobile);

  const handleParticipantChange = (index, field, value) => {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    if (field === "noGotra") {
      newParticipants[index].gotra = value ? "Kashyap" : "";
    }
    setParticipants(newParticipants);
  };

  const selectedPackageData = poojaData?.price?.[0]?.[type];
  const selectedAmount = selectedPackageData?.amaount || 0;

  const handleDontKnowGotraChange = (checked) => {
    setDontKnowGotra(checked);
    const newParticipants = participants.map((p) => ({
      ...p,
      gotra: checked ? "Kashyap" : p.gotra,
    }));
    setParticipants(newParticipants);
  };
  const isFormValid = () => {
    if (!isMobileValid || !termsAccepted) return false;
    return participants.every(
      (p) => p.username.trim() !== "" && p.gotra.trim() !== ""
    );
  };
  const handleLoginClick = () => {
    if (!isMobileValid || !termsAccepted) {
      setSnackbarOpen(true);
      return;
    }

    navigate("/razorpay", {
      state: {
        amount: selectedAmount,
        participants: participants,
        pkg: type,
        username: participants.map((p) => p.username).join(", "),
        userGotra: participants.map((p) => p.gotra).join(", "),
        mobile: mobile,
        id: poojaData?._id,
      },
    });
  };

  return (
    <Box sx={{ marginTop: "3%", width: "90%", mx: "auto" }}>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, md: 12, lg: 12 }}>
          <Box
            sx={{
              border: "1px solid lightgrey",
              padding: "1%",
              borderRadius: "1rem",
            }}
          >
            <Grid container spacing={2} alignContent={"center"}>
              <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
                <img
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                  src={
                    language === "hi"
                      ? poojaData?.images_hi?.[0]?.url
                      : poojaData?.images?.[0]?.url
                  }
                  alt={`slide`}
                />
              </Grid>
              <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
                <Box sx={{}}>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      mb: 1,
                      fontSize: "1.7rem",
                      fontWeight: 600,
                      marginTop: "2%",
                      opacity: "70%",
                      width: "100%",
                      color: "#79245a",
                    }}
                  >
                    {language === "hi" ? poojaData?.titleHi : poojaData?.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "1rem",
                      fontWeight: 500,
                      marginTop: "2%",
                      opacity: "90%",
                      color: "#7c3aed",
                    }}
                  >
                    {type
                      ? type.charAt(0).toUpperCase() +
                        type.slice(1) +
                        " " +
                        (language === "hi" ? "पैकेज" : "Package")
                      : ""}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "1rem",
                      fontWeight: 500,
                      marginTop: "2%",
                      color: "#79245a",
                    }}
                  >
                    {language === "hi"
                      ? poojaData?.subtitleHi
                      : poojaData?.subtitle}
                  </Typography>
                  <Typography
                    sx={{
                      mb: 1,
                      fontFamily: "Poppins",
                      fontSize: "1rem",
                      fontWeight: 500,
                      marginTop: "2%",
                      display: "flex",
                      gap: "0.5rem",
                      color: "#cd5200",
                    }}
                  >
                    <LocationOnOutlinedIcon sx={{ color: "#cd5200" }} />{" "}
                    {language === "hi"
                      ? poojaData?.locationHi
                      : poojaData?.location}
                  </Typography>
                  <Typography
                    sx={{
                      mb: 3,
                      fontFamily: "Poppins",
                      fontSize: "1rem",
                      fontWeight: 500,
                      marginTop: "2%",
                      opacity: "70%",
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <CalendarMonthOutlinedIcon />{" "}
                    {language === "hi" ? "तारीख: " : "Date: "}
                    {new Date(poojaData?.capDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item size={{ xs: 12, md: 12, lg: 6 }}>
          <Box
            sx={{
              display: "flex",
              gap: 4,
              border: "1px solid lightgrey",
              padding: "2%",
              borderRadius: "1rem",
            }}
          >
            <Box sx={{ width: "100%", p: 1 }}>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  mb: 1,
                  fontSize: "1.7rem",
                  fontWeight: 600,
                  marginTop: "2%",
                  opacity: "70%",
                  mb: 2,
                }}
              >
                {language === "hi" ? "बिलिंग विवरण" : "Billing Details"}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "90%",
                  margin: "auto",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "1rem",
                    fontWeight: 500,
                    marginTop: "2%",
                    opacity: "70%",
                  }}
                >
                  {language === "hi" ? "पूजा पैकेज" : "Puja Package"}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "1rem",
                    fontWeight: 500,
                    marginTop: "2%",
                    opacity: "70%",
                  }}
                >
                  {`₹${selectedAmount}`}
                </Typography>
              </Box>
              <hr style={{ opacity: "50%" }} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "90%",
                  margin: "auto",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "1rem",
                    fontWeight: 500,
                    marginTop: "2%",
                    opacity: "70%",
                  }}
                >
                  {language === "hi" ? "कुल" : "Total"}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "1rem",
                    fontWeight: 500,
                    marginTop: "2%",
                    opacity: "70%",
                  }}
                >
                  {`₹${selectedAmount}`}
                </Typography>
              </Box>
              <Typography
                sx={{
                  mb: 1,
                  fontFamily: "Poppins",
                  fontSize: "1rem",
                  fontWeight: 500,
                  marginTop: "2%",
                  opacity: "70%",
                }}
              >
                {/* {poojaData?.location} */}
              </Typography>
              <Typography
                sx={{
                  mb: 3,
                  fontFamily: "Poppins",
                  fontSize: "1rem",
                  fontWeight: 500,
                  marginTop: "2%",
                  opacity: "70%",
                  display: "flex",
                  gap: 1,
                }}
              >
                {/* <CalendarMonthOutlinedIcon /> Date:{" "}
                {new Date(poojaData?.capDate).toLocaleDateString()} */}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* <Grid item size={{ xs: 12, md: 12, lg: 8 }}>
          <Box
            sx={{
              mt: 4,
              p: 3,
              border: "1px solid lightgrey",
              borderRadius: "1rem",
              height: "50vh",
            }}
          >
            Add On Section
          </Box>
        </Grid> */}

        <Grid item size={{ xs: 12, md: 12, lg: 6 }}>
          <Box
            sx={{
              p: 3,
              border: "1px solid lightgrey",
              borderRadius: "1rem",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins",
                mb: 1,
                fontSize: "1.7rem",
                fontWeight: 600,
                marginTop: "2%",
                opacity: "70%",
                mb: 2,
              }}
            >
              {language === "hi"
                ? "भाग लेने वाले का विवरण"
                : "Participant Details"}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={dontKnowGotra}
                  onChange={(e) => handleDontKnowGotraChange(e.target.checked)}
                />
              }
              label={
                language === "hi" ? "गोत्र नहीं पता?" : "Don't Know Gotra?"
              }
              sx={{ mb: 2, fontFamily: "Poppins" }}
            />
            <Grid container spacing={2}>
              {participants.map((p, idx) => (
                <React.Fragment key={idx}>
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <TextField
                      placeholder={
                        language === "hi" ? "नाम दर्ज करें" : "Enter Name"
                      }
                      fullWidth
                      value={p.username}
                      onChange={(e) =>
                        handleParticipantChange(idx, "username", e.target.value)
                      }
                      sx={{ fontFamily: "Poppins" }}
                      inputProps={{ style: { fontFamily: "Poppins" } }}
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <TextField
                      placeholder={
                        language === "hi" ? "गोत्र जोड़ें" : "Add Gotra"
                      }
                      fullWidth
                      value={
                        dontKnowGotra && p.gotra === "" ? "Kashyap" : p.gotra
                      }
                      onChange={(e) => {
                        handleParticipantChange(idx, "gotra", e.target.value);
                        if (e.target.value?.length === 0) {
                          setDontKnowGotra(false);
                        }
                      }}
                      sx={{ fontFamily: "Poppins" }}
                      inputProps={{ style: { fontFamily: "Poppins" } }}
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            fontFamily: "Poppins",
            mb: 1,
            mb: 2,
            fontSize: "1.7rem",
            fontWeight: 600,
            marginTop: "2%",
            opacity: "70%",
          }}
        >
          {language === "hi" ? "बुक पूजा" : "Book Puja"}
        </Typography>
        <TextField
          label={language === "hi" ? "मोबाइल नंबर" : "Mobile Number"}
          fullWidth
          autoCapitalize="off"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          error={mobile.length > 0 && !isMobileValid}
          helperText={
            mobile.length > 0 && !isMobileValid
              ? language === "hi"
                ? "वैध 10 अंकों का मोबाइल नंबर दर्ज करें"
                : "Enter a valid 10-digit mobile number"
              : ""
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
          }
          label={
            language === "hi"
              ? "मैं नियम और शर्तें और गोपनीयता नीति से सहमत हूं"
              : "I agree to the Terms & Conditions and Privacy Policy"
          }
          sx={{ mt: 2, fontFamily: "Poppins" }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 2,
            textTransform: "none",
            background: "#7c3aed",
            color: "#fff",
            fontWeight: 600,
            borderRadius: 2,
            width: "100%",
            fontFamily: "Poppins",
            fontSize: 16,
            letterSpacing: 0.1,
            "&:hover": { background: "#cd5200" },
            "&:disabled": { background: "lightgrey" },
          }}
          disabled={!isFormValid()}
          onClick={handleLoginClick}
        >
          {language === "hi" ? "बुक पूजा" : "Book Puja"}
        </Button>
        {/* <RazorpayCheckout/> */}
        <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
          {language === "hi"
            ? "पूजा बुकिंग अपडेट, जिसमें फोटो, वीडियो और अन्य विवरण शामिल हैं, नीचे दिए गए WhatsApp नंबर पर भेजे जाएंगे।"
            : "Puja booking updates, including photos, videos, and other details, will be sent to the WhatsApp number provided below."}
        </Typography>
      </Box>
    </Box>
  );
}
