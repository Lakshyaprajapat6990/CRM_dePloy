import React, { useContext } from "react";
import { Box, Button, Typography, Paper, Fade, Grow } from "@mui/material";
import { LanguageContext } from "../../context/LanguageContext";
import wtspLogo from "../../assests/wtsp.png";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import { styled, keyframes } from "@mui/system";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 40px, 0);
  }
  to {
    opacity: 1;
    transform: none;
  }
`;

const AnimatedPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 700,
  margin: "auto",
  marginTop: theme.spacing(6),
  backgroundColor: theme.palette.mode === "dark" ? "#2c1b44" : "#f3e8ff",
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 8px 30px rgba(237,106,18,0.1)",
  animation: `${fadeInUp} 1s ease forwards`,
  textAlign: "center",
}));

const ContactButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  backgroundColor: "#9a67e6",
  color: "#fff",
  fontWeight: 700,
  "&:hover": {
    backgroundColor: "#cd5200",
  },
  fontFamily: "'Poppins', sans-serif",
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.shape.borderRadius,
  textTransform: "none",
  boxShadow: "0 4px 15px rgba(237, 106, 18, 0.25)",
}));

export default function ContactUs() {
  const { language } = useContext(LanguageContext);

  const email = "support@devyogam.com";
  const phone = "+91 7024542030";

  return (
    <Box
      sx={{
        minHeight: "80vh",
        bgcolor: "#f9f5ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        py: 6,
      }}
    >
      <AnimatedPaper elevation={4}>
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
            color: "#5C2C6D",
          }}
        >
          {language === "hi" ? "हमसे संपर्क करें" : "Contact Us"}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "1.1rem",
            color: "#4a2e69",
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          {language === "hi"
            ? "देवयोगम एक आध्यात्मिक मंच है जो भारतीय संस्कृति और श्रद्धा को समर्पित है। हम आपको घर बैठे पूजा, चढ़ावा, और मंदिर दर्शन की सेवाएं प्रदान करते हैं।"
            : "Devyogam is a spiritual platform dedicated to Indian culture and devotion. We offer personalized puja, chadhava, and temple visit services from the comfort of your home."}
        </Typography>

        {/* Email */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            justifyContent: "center",
            mb: 1,
            color: "#7C4D9A",
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <EmailOutlinedIcon />
          <Typography
            sx={{
              fontSize: "1.1rem",
            }}
          >
            {email}
          </Typography>
        </Box>

        {/* Phone */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            justifyContent: "center",
            mb: 3,
            color: "#7C4D9A",
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <PhoneAndroidOutlinedIcon />
          <Typography
            sx={{
              fontSize: "1.1rem",
            }}
          >
            {phone}
          </Typography>
        </Box>

        {/* Whatsapp Button */}
        <ContactButton
          startIcon={<img src={wtspLogo} alt="Whatsapp" style={{ width: 24, height: 24 }} />}
          onClick={() => window.open(`https://wa.me/917024542030`, "_blank")}
          aria-label={language === "hi" ? "व्हाट्सएप पर चैट करें" : "Chat on Whatsapp"}
        >
          {language === "hi" ? "व्हाट्सएप चैट करें" : "Chat on Whatsapp"}
        </ContactButton>
      </AnimatedPaper>
    </Box>
  );
}
