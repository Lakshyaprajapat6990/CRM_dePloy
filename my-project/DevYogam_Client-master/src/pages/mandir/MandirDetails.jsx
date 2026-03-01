import React, { useEffect, useState, useContext } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Paper,
  styled,
  Button,
} from "@mui/material";
import { GlobalCssStyles } from "../../style/GlobalCSS";
import { useParams } from "react-router-dom";
import { GetMandirByID } from "../../services/GetMandirByID";
import { LanguageContext } from "../../context/LanguageContext";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import wtspLogo from "../../assests/wtsp.png";
import mandirIcon from "../../assests/temple.png";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment"; // for Yagya
import EventAvailableIcon from "@mui/icons-material/EventAvailable"; // for Pooja
import FavoriteIcon from "@mui/icons-material/Favorite"; // for Chadhava

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function MandirDetails() {
  const { language } = useContext(LanguageContext);
  const { id } = useParams();
  const [mandirData, setMandirData] = useState(null);

  useEffect(() => {
    const fetchMandir = async () => {
      const res = await GetMandirByID(id);

      // Language picking helper
      const pickLang = (obj, base) =>
        obj?.[`${base}${language === "hi" ? "Hi" : ""}`] ?? obj?.[base];

      const filtered = {
        ...res,
        title: pickLang(res, "title"),
        location: pickLang(res, "location"),
        bhagwan: pickLang(res, "bhagwan"),
        templeDescription: pickLang(res, "templeDescription"),
        longDescription: pickLang(res, "longDescription"),
        images:
          language === "hi" &&
          Array.isArray(res.images_hi) &&
          res.images_hi.length > 0
            ? res.images_hi
            : res.images || [],
      };

      setMandirData(filtered);
    };

    fetchMandir();
  }, [id, language]);

  if (!mandirData) return null;

  // Scrolling notice component
  const ScrollingNotice = () => (
    <Box
      sx={{
        padding: "10px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative",
        height: "40px",
        display: "flex",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Typography
        component="div"
        sx={{
          fontFamily: "Poppins",
          fontSize: "1rem",
          fontWeight: 500,
          color: "#79245a",
          whiteSpace: "nowrap",
          display: "inline-block",
          animation: "scrollText 12s linear infinite",
          "@keyframes scrollText": {
            "0%": { transform: "translateX(100%)" },
            "100%": { transform: "translateX(-100%)" },
          },
        }}
      >
        <strong style={{ color: "#cd5200" }}>870+ </strong>
        {language === "hi"
          ? "भक्तों ने देव योगम के माध्यम से इस मंदिर से व्यक्तिगत पूजा बुक करी है"
          : "Devotees selected this temple with Dev Yogam"}
      </Typography>
    </Box>
  );

  return (
    <GlobalCssStyles>
      <Box sx={{ marginTop: "3%", width: "90%", mx: "auto" }}>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, md: 12, lg: 6 }}>
            <Item>
              <Card sx={{ borderRadius: 2 }}>
                <Carousel showThumbs={false} showStatus={false} infiniteLoop>
                  {mandirData?.images?.map((img, idx) => (
                    <div key={img._id || idx}>
                      <img
                        src={img.url}
                        alt={`${idx}`}
                        style={{ borderRadius: 12 }}
                      />
                    </div>
                  ))}
                </Carousel>
              </Card>
            </Item>
          </Grid>
          <Grid item size={{ xs: 12, md: 12, lg: 6 }}>
            <Item>
              <Box sx={{ fontFamily: "Poppins", color: "#79245a" }}>
                <Typography
                  sx={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "#cd5200",
                    mb: 1,
                    textAlign: "left",
                    fontFamily: "Poppins",
                  }}
                >
                  {mandirData.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    mb: 1,
                    textAlign: "left",
                    fontFamily: "Poppins",
                  }}
                >
                  {mandirData?.subTitle}
                </Typography>
                <Box
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "1rem",
                    fontWeight: 500,
                    marginTop: "2%",
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  <img src={mandirIcon} style={{ objectFit: "contain" }} />{" "}
                  <Typography
                    mt={1}
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "1rem",
                      fontWeight: 500,
                      marginTop: "2%",
                      display: "flex",
                      gap: "0.5rem",
                      textAlign: "left",
                    }}
                  >
                    {mandirData?.subTitle}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "1rem",
                    fontWeight: 500,
                    marginTop: "2%",
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  <LocationOnOutlinedIcon sx={{ color: "#cd5200" }} />{" "}
                  <Typography
                    variant="body1"
                    mt={1}
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "1rem",
                      fontWeight: 500,
                      marginTop: "2%",
                      display: "flex",
                      gap: "0.5rem",
                      textAlign: "left",
                      color: "#cd5200",
                    }}
                  >
                    {mandirData?.location}
                  </Typography>
                </Box>

                <ScrollingNotice />

                <Box
                  sx={{
                    width: "100%",
                    marginTop: "2%",
                    display: "flex",
                    alignItems: "end",
                  }}
                >
                  <Button
                    sx={{
                      backgroundColor: "#9a67e6",
                      color: "#fff",
                      borderRadius: 2,
                      textTransform: "none",
                      fontFamily: "Poppins",
                      fontWeight: 600,
                      py: 0.5,
                      height: "3rem",
                      fontSize: 16,
                      boxShadow: "0 2px 8px 2px rgba(237,106,18,0.09)",
                      mt: 1,
                      letterSpacing: 0.1,
                      "&:hover": { background: "#cd5200" },
                      width: "80%",
                    }}
                    onClick={() =>
                      window.open("https://wa.me/917024542030", "_blank")
                    }
                  >
                    {language === "hi"
                      ? "व्यक्तिगत पूजा बुक करें"
                      : "Book Personal Pooja"}
                  </Button>
                  <Button
                    sx={{ marginTop: "10px" }}
                    onClick={() =>
                      window.open("https://wa.me/917024542030", "_blank")
                    }
                  >
                    <img
                      style={{ width: "45px", height: "45px" }}
                      src={wtspLogo}
                      alt="Whatsapp"
                    />
                  </Button>
                </Box>
              </Box>
            </Item>
          </Grid>
        </Grid>
        <Box sx={{ width: "90%", margin: "auto" }}>
          <Box sx={{ mt: 4, width: "100%" }}>
            <Typography
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: "1.5rem",
                fontFamily: "Poppins",
                color: "#89255b",
              }}
            >
              {language === "hi"
                ? "देव योगम द्वारा इस मंदिर में उपलब्ध सेवाए"
                : "Service By Dev Yogam at This Temple"}
            </Typography>

            <Box
              sx={{
                padding: "10px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                overflow: "hidden",
                position: "relative",
                height: "40px",
                display: "flex",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                component="div"
                sx={{
                  fontFamily: "Poppins",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "#79245a",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  animation: "scrollText 18s linear infinite",
                  "@keyframes scrollText": {
                    "0%": { transform: "translateX(100%)" },
                    "100%": { transform: "translateX(-100%)" },
                  },
                }}
              >
                <strong style={{ color: "#cd5200" }}>
                  {language === "hi" ? "सूचना:" : "Notice:"}{" "}
                </strong>
                {language === "hi"
                  ? "आप इस मंदिर में अपने एवं अपने परिवार के लिए सीधे देव योगम से जुड़कर निम्न उपलब्ध सेवाओं का व्यक्तिगत रूप से लाभ उठा सकते हैं"
                  : "You and your family can personally avail the following services at this temple by directly connecting with Dev Yogam."}
              </Typography>
            </Box>

            <Grid container spacing={3} alignContent={"center"}>
              {/* Personal/Special Pooja Card */}
              <Grid item xs={12} md={4} size={{ md: 4, lg: 4, xs: 12, sm: 12 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: "2px solid lighgrey",
                    p: 2,
                    transition: "transform 0.3s ease",
                    boxShadow: 3,
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <EventAvailableIcon
                    sx={{ fontSize: 36, color: "#7725b2", mb: 1 }}
                  />
                  <Typography variant="h6" fontWeight={700} mb={0.5}>
                    {language === "hi" ? "विशेष पूजा" : "Personal Pooja"}
                  </Typography>
                  <Typography
                    color="#6d6b7c"
                    fontFamily={"Poppins"}
                    fontWeight={500}
                    mb={2}
                  >
                    {language === "hi"
                      ? "₹901 से प्रारंभ"
                      : "Starting from ₹901"}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#7725b2",
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: "none",
                    }}
                    onClick={() =>
                      window.open("https://wa.me/917024542030", "_blank")
                    }
                  >
                    {language === "hi" ? "पुजा बुक करें" : "Book Pooja"}
                  </Button>
                </Card>
              </Grid>
              {/* Virtual Chadhava Card */}
              <Grid item size={{ md: 4, lg: 4, xs: 12, sm: 12 }} xs={12} md={4}>
                <Card
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: "2px solid lighgrey",
                    p: 2,
                    transition: "transform 0.3s ease",
                    boxShadow: 3,
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <FavoriteIcon
                    sx={{ fontSize: 36, color: "#89255b", mb: 1 }}
                  />
                  <Typography
                    variant="h6"
                    fontFamily={"Poppins"}
                    fontWeight={700}
                    mb={0.5}
                  >
                    {language === "hi" ? "वर्चुअल चढ़ावा" : "Virtual Chadhava"}
                  </Typography>
                  <Typography
                    color="#6d6b7c"
                    fontFamily={"Poppins"}
                    fontWeight={500}
                    mb={2}
                  >
                    {language === "hi"
                      ? "₹101 से प्रारंभ"
                      : "Starting from ₹101"}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#89255b",
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: "none",
                    }}
                    onClick={() =>
                      window.open("https://wa.me/917024542030", "_blank")
                    }
                  >
                    {language === "hi" ? "चढ़ावा बुक करें" : "Book Chadhava"}
                  </Button>
                </Card>
              </Grid>
              {/* Yagya Card */}
              <Grid item size={{ md: 4, lg: 4, xs: 12, sm: 12 }} xs={12} md={4}>
                <Card
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: "2px solid lighgrey",
                    p: 2,
                    transition: "transform 0.3s ease",
                    boxShadow: 3,
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <LocalFireDepartmentIcon
                    sx={{ fontSize: 36, color: "#e24e35", mb: 1 }}
                  />
                  <Typography
                    variant="h6"
                    fontFamily={"Poppins"}
                    fontWeight={700}
                    mb={0.5}
                  >
                    {language === "hi"
                      ? "यज्ञ अनुष्ठान"
                      : "Special Yagya Ritual"}
                  </Typography>
                  <Typography
                    color="#6d6b7c"
                    fontFamily={"Poppins"}
                    fontWeight={500}
                    mb={2}
                  >
                    {language === "hi"
                      ? "यज्ञ अनुष्ठान करवाने के लिए संपर्क करें"
                      : "Connect us for a personalized Yagya"}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#e24e35",
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: "none",
                    }}
                    onClick={() =>
                      window.open("https://wa.me/917024542030", "_blank")
                    }
                  >
                    {language === "hi" ? "विवरण भेजें" : "Submit Details"}
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mt: 6, width: "100%" }}>
            <Typography
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 3,
                mt: 3,
                fontSize: "1.5rem",
                fontFamily: "Poppins",
                color: "#2c7a7b",
              }}
            >
              {language === "hi" ? "मंदिर के बारे में " : "About Temple"}
            </Typography>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1.1rem",
                mb: 1,
                color: "#444",
              }}
            >
              {mandirData.templeDescription}
            </Typography>
          </Box>

          <Box sx={{ mt: 6, width: "100%" }}>
            <Typography
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: "1.5rem",
                fontFamily: "Poppins",
                color: "#2c7a7b",
              }}
            >
              {language === "hi" ? "मंदिर के लाभ " : "Benefits of the Temple"}
            </Typography>
            <Typography
              sx={{
                mb: 3,
                fontSize: "1rem",
                fontWeight: 500,
                fontFamily: "Poppins",
              }}
            >
              {mandirData.longDescription}
            </Typography>
          </Box>
        </Box>
      </Box>
    </GlobalCssStyles>
  );
}
