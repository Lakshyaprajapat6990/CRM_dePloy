import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import ServiceCard from "../../component/ServiceCard";
import TempleHinduOutlinedIcon from "@mui/icons-material/TempleHinduOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../context/LanguageContext";
import { useMediaQuery, useTheme } from "@mui/material";

const servicesData = [
  {
    icon: <LocalFireDepartmentOutlinedIcon fontSize="inherit" />,
    title: "Pujas",
    titleHi: "पूजा",
    description:
      "Book personalized online pujas with Devyogam, performed by experienced priests, and receive the puja video on your mobile.",
    descriptionHi:
"देवयोगम के साथ व्यक्तिगत ऑनलाइन पूजा बुक करें, जो अनुभवी पुजारियों द्वारा कराई जाएगी, और पूजा का पूरा वीडियो सीधे अपने मोबाइल पर प्राप्त करें।",
    btnLabel: "Book Now",
    btnLabelHi: "बुक करें",
    link: "/pooja",
    linkHi: "/hi/pooja",
  },
  {
    icon: <EmojiObjectsOutlinedIcon fontSize="inherit" />,
    title: "Chadhava",
    titleHi: "चढ़ावा",
    description:
      "Offer chadava at India’s most renowned temples and be part of traditions. Seek divine blessings for yourself, all from the your home.",
    descriptionHi:
      "भारत के सबसे प्रसिद्ध मंदिरों में चढ़ावा अर्पित करें और प्राचीन परंपराओं का हिस्सा बनें। अपने घर के आराम से दिव्य आशीर्वाद प्राप्त करें।",
    btnLabel: "Offer Now",
    btnLabelHi: "अर्पित करें",
    link: "/chadhava",
    linkHi: "/hi/chadhava",
  },
  {
    icon: <TempleHinduOutlinedIcon fontSize="inherit" />,
    title: "Temples",
    titleHi: "मंदिर",
    description:
      "Connect with India’s most revered temples, participate in rituals, and be part of a divine spiritual journey from anywhere.",
    descriptionHi:
      "भारत के सबसे पूजनीय मंदिरों से जुड़ें, अनुष्ठानों में भाग लें, और कहीं से भी दिव्य आध्यात्मिक यात्रा का हिस्सा बनें।",
    btnLabel: "Join Now",
    btnLabelHi: "जुड़ें",
    link: "/temple",
    linkHi: "/hi/temple",
  },
];

export default function OurServices() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  // Map services based on current language
  const services = servicesData.map((service) => ({
    ...service,
    title: language === "hi" ? service.titleHi || service.title : service.title,
    description:
      language === "hi"
        ? service.descriptionHi || service.description
        : service.description,
    btnLabel:
      language === "hi"
        ? service.btnLabelHi || service.btnLabel
        : service.btnLabel,
    link: language === "hi" ? service.linkHi || service.link : service.link,
  }));

  return (
    <Box sx={{ width: "90%", margin: "auto" }}>
      <Typography
        sx={{
          fontFamily: "Poppins",
          fontSize: "2rem",
          fontWeight: 600,
          textAlign: "center",
          color: "#cd5200",
          marginTop: !isMobile ? "2%" : "2px",
        }}
      >
        {language === "hi" ? "हमारी सेवाएं" : "Our Services"}
      </Typography>
      <Grid container spacing={4} py={4} justifyContent={"center"}>
        {services.map((service, idx) => (
          <Grid key={idx} item size={{ xs: 12, md: 6, sm: 4, lg: 4 }}>
            <ServiceCard
              onClick={() => navigate(service?.link)}
              icon={service.icon}
              title={service.title}
              description={service.description}
              btnLabel={service.btnLabel}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
