import React from "react";
import {
  Box,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";

// All process steps (add/adjust as needed)
const processStepsByType = {
  pooja: [
    {
      title: {
        en: "Select a Puja",
        hi: "एक पूजा चुनें",
      },
      description: {
        en: "First you have to choose a puja you want to perform.",
        hi: "सबसे पहले आपको एक पूजा चुननी होगी, जिसे आप करना चाहते हैं।",
      },
    },
    {
      title: {
        en: "Select a Puja Pack",
        hi: "एक पूजा पैक चुनें",
      },
      description: {
        en: "After selecting Puja, choose a Puja Pack as per your need — Individual, Partner or Family.",
        hi: "पूजा चुनने के बाद आपको पूजा पैक चुनना होगा — व्यक्तिगत, साथी या परिवार के लिए।",
      },
    },
    {
      title: {
        en: "Fill the Details",
        hi: "विवरण भरें",
      },
      description: {
        en: "Fill in details such as your name, gotra, and other essentials.",
        hi: "अपना नाम, गोत्र आदि विवरण भरें।",
      },
    },
    {
      title: {
        en: "Booking Confirmation",
        hi: "बुकिंग पुष्टि",
      },
      description: {
        en: "Our Team will reach out and verify the details you provided.",
        hi: "हमारी टीम आपसे संपर्क करेगी और आपके द्वारा दिए गए विवरणों की पुष्टि करेगी।",
      },
    },
    {
      title: {
        en: "Get Puja Video",
        hi: "पूजा वीडियो प्राप्त करें",
      },
      description: {
        en: "After 5-7 days of puja, receive your personalized puja video on WhatsApp.",
        hi: "पूजा के 5-7 दिन बाद आपको व्हाट्सएप पर पूजा का व्यक्तिगत वीडियो मिलेगा।",
      },
    },
  ],
  chadhava: [
    {
      title: {
        en: "Select Chadhava",
        hi: "चढ़ावा चुनें",
      },
      description: {
        en: "Choose the offering (chadhava) you want to present.",
        hi: "चुनें कि कौन सा चढ़ावा आप अर्पित करना चाहते हैं।",
      },
    },
    {
      title: {
        en: "Fill Details",
        hi: "विवरण भरें",
      },
      description: {
        en: "Provide your personal and offering details.",
        hi: "अपना व्यक्तिगत और चढ़ावा विवरण भरें।",
      },
    },
    {
      title: {
        en: "Payment & Submission",
        hi: "भुगतान और सबमिशन",
      },
      description: {
        en: "Complete the payment and submit your offering request.",
        hi: "भुगतान पूरा करें और अपना चढ़ावा अनुरोध सबमिट करें।",
      },
    },
    {
      title: {
        en: "Confirmation",
        hi: "पुष्टि",
      },
      description: {
        en: "You’ll receive a confirmation for your chadhava and get updates.",
        hi: "आपको आपके चढ़ावे की पुष्टि और अपडेट मिलेंगे।",
      },
    },
    {
      title: {
        en: "Receive Prasad/Blessings",
        hi: "प्रसाद/आशीर्वाद प्राप्त करें",
      },
      description: {
        en: "Receive blessings and prasad, if applicable, by your chosen mode.",
        hi: "अपने चुने गए माध्यम से आशीर्वाद और प्रसाद प्राप्त करें (जहां लागू हो)।",
      },
    },
  ],
  mandir: [
    {
      title: {
        en: "Select Mandir",
        hi: "मंदिर चुनें",
      },
      description: {
        en: "Pick the temple you wish to contribute towards.",
        hi: "जिस मंदिर में आप योगदान करना चाहते हैं, उसे चुनें।",
      },
    },
    {
      title: {
        en: "Choose Contribution Mode",
        hi: "योगदान का तरीका चुनें",
      },
      description: {
        en: "Select your preferred contribution (funds, items, or service).",
        hi: "अपना पसंदीदा योगदान प्रकार चुनें (धनराशि, सामान या सेवा)।",
      },
    },
    {
      title: {
        en: "Fill Details",
        hi: "विवरण भरें",
      },
      description: {
        en: "Share your contact and contribution details.",
        hi: "अपने संपर्क विवरण और योगदान की जानकारी भरें।",
      },
    },
    {
      title: {
        en: "Contribution Confirmation",
        hi: "योगदान की पुष्टि",
      },
      description: {
        en: "You'll receive a confirmation/receipt from the mandir.",
        hi: "मंदिर से आपको पुष्टि या रसीद प्राप्त होगी।",
      },
    },
    {
      title: {
        en: "Prasad or Acknowledgement",
        hi: "प्रसाद या प्रमाण पत्र",
      },
      description: {
        en: "Receive prasad or acknowledgement (as applicable) from the Mandir.",
        hi: "मंदिर से प्रसाद या प्रमाण पत्र प्राप्त करें (जहां लागू हो)।",
      },
    },
  ]
};

const getStepsData = (type) => processStepsByType[type] || processStepsByType["pooja"];

const getTypeLabel = (type, language) => {
  const labels = {
    pooja:
      language === "hi"
        ? "पूजा प्रक्रिया कैसे काम करती है?"
        : "How Puja Process Works?",
    chadhava:
      language === "hi"
        ? "चढ़ावा अर्पित करने की प्रक्रिया"
        : "How Chadhava Process Works?",
    mandir:
      language === "hi"
        ? "मंदिर में योगदान प्रक्रिया"
        : "How Mandir Process Works?",
    default: language === "hi" ? "यह कैसे काम करता है?" : "How it works?",
  };
  return labels[type] || labels.default;
};

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.8,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

// Main component
const ProcessSteps = ({ type = "pooja", language = "en" }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const stepsData = getStepsData(type);

  return (
    <Box sx={{ mt: 5, width: "100%", maxWidth: 1100, mx: "auto" }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 3,
          fontFamily: "Poppins",
          fontSize: { xs: "1.25rem", md: "2rem", lg: "2rem" },
          color: "#cd5200",
          textAlign: "start",
        }}
      >
        {getTypeLabel(type, language)}
      </Typography>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid
          container
          spacing={isSmall ? 3 : 0}
          alignItems="flex-start"
          justifyContent="center"
        >
          {stepsData.map((step, idx) => (
            <Grid item size={{ xs: 12, md: 12, lg: 12 }} key={idx}>
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "start",
                    gap: "1rem",
                    p: isSmall ? 2 : 3,
                    background: "#80245f10",
                    boxShadow: 3,
                    borderRadius: ".5rem",
                    mb: 2,
                    minHeight: { xs: 60, md: 80 },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "#80245f",
                      color: "#fff",
                      width: { xs: 24, md: 44 },
                      height: { xs: 24, md: 44 },
                      mb: 1,
                      fontWeight: 700,
                      fontSize: { xs: "0.75rem", md: "1rem" },
                      fontFamily: "Poppins",
                    }}
                  >
                    {idx + 1}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontSize: { xs: "1rem", md: "1.25rem" },
                        fontWeight: 600,
                        textAlign: "start",
                        mb: 1,
                        fontFamily: "Poppins",
                        color: "#333",
                      }}
                    >
                      {step.title[language]}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: "0.8rem", md: "1rem" },
                        textAlign: "start",
                        color: "#333",
                        fontFamily: "Poppins",
                      }}
                    >
                      {step.description[language]}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default ProcessSteps;
