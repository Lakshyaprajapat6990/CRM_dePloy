import React, { useEffect, useState, useContext } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { GlobalCssStyles } from "../../style/GlobalCSS";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate, useParams } from "react-router-dom";
import { GetPoojaByID } from "../../services/GetPoojaByID";
import { alpha, styled } from "@mui/material/styles";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Grid from "@mui/material/Grid";
import wtspLogo from "../../assests/wtsp.png";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import single from "../../assests/single.png";
import couple from "../../assests/couples.png";
import family from "../../assests/family.png";
import process from "../../assests/process.jpg";
import { HidePoojaAPI } from "../../services/HidePoojaAPI";
import { LanguageContext } from "../../context/LanguageContext";
import ProcessSteps from "../../component/ProcessStep";

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function PoojaDetails({ user }) {
  const navigate = useNavigate();
  const { name, id } = useParams();
  const { language } = useContext(LanguageContext);
  const [poojaData, setPoojaData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser?.role || "user";

  useEffect(() => {
    const getPooja = async () => {
      const res = await GetPoojaByID(id);

      // Prefilter data based on language before setting state
      const lang = language === "hi" ? "Hi" : "";

      const pickLang = (obj, base) => obj?.[`${base}${lang}`] ?? obj?.[base];

      const filtered = {
        ...res,
        title: pickLang(res, "title"),
        subtitle: pickLang(res, "subtitle"),
        location: pickLang(res, "location"),
        images:
          lang === "Hi" &&
          Array.isArray(res.images_hi) &&
          res.images_hi.length > 0
            ? res.images_hi
            : res.images || [],
        price: Array.isArray(res.price)
          ? res.price.map((p) => ({
              ...p,
              single: {
                ...p.single,
                description: pickLang(p.single, "description"),
              },
              couple: {
                ...p.couple,
                description: pickLang(p.couple, "description"),
              },
              family: {
                ...p.family,
                description: pickLang(p.family, "description"),
              },
            }))
          : [],
        benefit: Array.isArray(res.benefit)
          ? res.benefit.map((b) => ({
              ...b,
              title: pickLang(b, "title"),
              description: pickLang(b, "description"),
            }))
          : [],
        faq: Array.isArray(res.faq)
          ? res.faq.map((f) => ({
              ...f,
              question: pickLang(f, "question"),
              answer: pickLang(f, "answer"),
            }))
          : [],
      };

      setPoojaData(filtered);
    };
    getPooja();
  }, [id, language]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const priceDetails = poojaData?.price?.[0] || {};

  const pricePackages = [
    {
      key: "single",
      title: language === "hi" ? "सिंगल" : "Single",
      subtitle: language === "hi" ? "1 व्यक्ति हेतु" : "For 1 person",
      image: single,
      recommended: false,
    },
    {
      key: "couple",
      title: language === "hi" ? "दम्पति" : "Couple",
      subtitle: language === "hi" ? "2 व्यक्तियों तक" : "Upto 2 people",
      image: couple,
      recommended: true,
    },
    {
      key: "family",
      title: language === "hi" ? "परिवार" : "Family",
      subtitle: language === "hi" ? "4 व्यक्तियों तक" : "Upto 4 people",
      image: family,
      recommended: false,
    },
  ];

  const handleNavigate = (type, name, id) => {
    navigate(`/pooja-booking/${type}/${name}/${id}`);
  };
  const handleHidePooja = async (id) => {
    handleMenuClose();
    await HidePoojaAPI("/poojas/delete",id);
  };

  if (!poojaData) return null;

  return (
    <GlobalCssStyles>
      <Box sx={{ marginTop: "3%" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, md: 12, lg: 6 }}>
              <Item>
                <Carousel
                  showThumbs={false}
                  showStatus={false}
                  showIndicators
                  infiniteLoop
                >
                  {poojaData.images?.map((img, idx) => (
                    <div key={img._id || idx}>
                      <img
                        src={img.url}
                        alt={`slide-${idx}`}
                        style={{ borderRadius: 12 }}
                      />
                    </div>
                  ))}
                </Carousel>
              </Item>
            </Grid>
            <Grid size={{ xs: 12, md: 12, lg: 6 }}>
              <Item>
                <Box sx={{ textAlign: "start", fontFamily: "Poppins" }}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        marginTop: "2%",
                        color: "#cd5200",
                      }}
                    >
                      {poojaData.title}
                    </Typography>
                    {userRole === "admin" && (
                      <>
                        <IconButton
                          color="inherit"
                          onClick={handleMenuOpen}
                          sx={{ color: "#333" }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                        >
                          <MenuItem
                            sx={{
                              transition: "background-color 0.3s, color 0.3s",
                              "&:hover": {
                                backgroundColor: alpha("#aa4466", 0.1),
                                color: "#aa4466",
                              },
                            }}
                            onClick={() =>
                              window.open(
                                `${window?.location?.origin}/pooja/edit/${id}`
                              )
                            }
                          >
                            Edit
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleHidePooja(id);
                            }}
                            sx={{
                              transition: "background-color 0.3s, color 0.3s",
                              "&:hover": {
                                backgroundColor: alpha("#aa4466", 0.1),
                                color: "#aa4466",
                              },
                            }}
                          >
                            Hide
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "1rem",
                      fontWeight: 500,
                      marginTop: "2%",
                      color: "#79245a",
                    }}
                  >
                    {poojaData.subtitle}
                  </Typography>

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
                      color: "#cd5200",
                    }}
                  >
                    <LocationOnOutlinedIcon sx={{ color: "#cd5200" }} />{" "}
                    {poojaData.location}
                  </Typography>
                  <Typography
                    mt={1}
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "1rem",
                      fontWeight: 500,
                      marginTop: "2%",
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    <CalendarMonthOutlinedIcon />{" "}
                    {new Date(poojaData.capDate).toLocaleDateString()}
                  </Typography>
                  <hr style={{ marginTop: "2%", opacity: "70%" }} />

                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "1rem",
                      fontWeight: 500,
                      marginTop: "2%",
                      color: "#79245a",
                    }}
                  >
                    <strong style={{ color: "#cd5200" }}>1000+ </strong>
                    {language === "hi"
                      ? "भक्तों ने इस पूजा को देव योगम के साथ बुक किया"
                      : "Devotees booked this Puja with Dev Yogam"}
                  </Typography>

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
                      onClick={() => {
                        handleNavigate("single", name, id);
                      }}
                    >
                      {language === "hi" ? "पुजा बुक करें" : "Book Pooja"}
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
          {poojaData?.price?.length > 0 && (
            <Box sx={{ mt: 5, width: "90%", display: "block", mx: "auto" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  fontFamily: "Poppins",
                  fontSize: { sx: "1.5rem", md: "2rem", lg: "2rem" },
                  color: "#79245a",
                }}
              >
                {language === "hi" ? "पुजा पैकेज चुनें" : "Select Puja Package"}
              </Typography>
              <Grid container spacing={3}>
                {pricePackages.map((pkg) => {
                  const data = priceDetails[pkg.key];
                  if (!data || data.amaount == null) return null;
                  const benefits = (
                    language === "hi"
                      ? data.descriptionHi || data.description
                      : data.description
                  )
                    ?.split(". ")
                    .filter(Boolean);
                  return (
                    <Grid
                      item
                      size={{ xs: 12, md: 4, lg: 4, sm: 12 }}
                      gap={10}
                      key={pkg.key}
                    >
                      <Box sx={{ p: 1 }}>
                        <Card
                          variant="outlined"
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
                          onClick={() => handleNavigate(pkg.key, name, id)}
                        >
                          <CardContent sx={{ flexGrow: 1, p: 0 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="h5"
                                  sx={{
                                    fontWeight: 500,
                                    mb: 1,
                                    fontFamily: "Poppins",
                                    color: "#cd5200",
                                  }}
                                >
                                  {pkg.title}
                                </Typography>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: "#7c3aed",
                                    fontWeight: 700,
                                    mb: 1,
                                    fontFamily: "Poppins",
                                  }}
                                >
                                  {data.amaount !== null
                                    ? `₹${data.amaount}`
                                    : language === "hi"
                                    ? "मूल्य पूछें"
                                    : "Contact for price"}
                                </Typography>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    mb: 1,
                                    color: "#444",
                                    fontFamily: "Poppins",
                                  }}
                                >
                                  {pkg.subtitle}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  mb: 2,
                                }}
                              >
                                <img
                                  style={{
                                    minWidth: "8vw",
                                    height: "15vh",
                                    borderRadius: "1rem",
                                    objectFit: "cover",
                                  }}
                                  src={pkg.image}
                                  alt={pkg.title}
                                />
                              </Box>
                            </Box>
                            <Box sx={{ mb: 2, flexGrow: 1, mt: 4 }}>
                              {benefits?.map((benefit, i) => (
                                <Typography
                                  key={i}
                                  variant="body2"
                                  sx={{
                                    fontFamily: "Poppins",
                                    color: "#555",
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {benefit}
                                </Typography>
                              ))}
                            </Box>
                          </CardContent>
                          <CardActions sx={{ p: 0 }}>
                            <Button
                              variant="contained"
                              fullWidth
                              sx={{
                                mt: 1,
                                backgroundColor: "#7c3aed",
                                color: "#fff",
                                fontWeight: 600,
                                borderRadius: 2,
                                fontFamily: "Poppins",
                                fontSize: 16,
                                letterSpacing: 0.1,
                                "&:hover": { background: "#cd5200" },
                              }}
                              onClick={() => handleNavigate(pkg.key, name, id)}
                            >
                              {language === "hi"
                                ? "पैकेज चुने"
                                : "Confirm Package"}
                            </Button>
                          </CardActions>
                        </Card>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
          <Box sx={{ mt: 5, width: "90%", mx: "auto" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ProcessSteps type="pooja" language={language} />
            </Box>
          </Box>

          <Box sx={{ width: "90%", margin: "auto" }}>
            {poojaData?.benefit?.length > 0 && (
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
                  {language === "hi" ? " पूजा से होने वाले लाभ" : "Benefits"}
                </Typography>
                {poojaData.benefit.map((item) => (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                    key={item._id}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 1,
                        fontFamily: "Poppins",
                        lineHeight: 1.5,
                        color: "#79245a",
                        fontSize: "1.2rem",
                        fontWeight: 600,
                      }}
                    >
                      {item?.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        mb: 2,
                        fontFamily: "Poppins",
                        color: "#444",
                      }}
                    >
                      {item?.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {poojaData?.faq?.length > 0 && (
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
                  {language === "hi" ? "प्रश्नोत्तर" : "FAQs"}
                </Typography>
                {poojaData.faq.map((item) => (
                  <Box
                    key={item._id}
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: 1,
                    }}
                  >
                    <Accordion
                      sx={{
                        bgcolor: "white",
                        "&:before": { display: "none" },
                        "&.Mui-expanded": { bgcolor: "#f0f0f0" },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ px: 2 }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{ fontFamily: "Poppins" }}
                        >
                          {item?.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 3, py: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "pre-line", fontFamily: "Poppins" }}
                        >
                          {item?.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            left: 0,
            width: "90%",
            margin: "auto",
            bgcolor: "#f9f9f9",
            borderTop: "1px solid #ccc",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
            px: { xs: 2, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            fontFamily: "'Poppins', sans-serif",
            zIndex: 10,
            gap: { xs: 1, sm: 0 },
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
              width: "100%",
            }}
            onClick={() => {
              handleNavigate("single", name, id);
            }}
          >
            {language === "hi" ? "पुजा बुक करें" : "Book Pooja"}
          </Button>
        </Box>
      </Box>
    </GlobalCssStyles>
  );
}
