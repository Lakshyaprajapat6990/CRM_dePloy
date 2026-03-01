import React, { useEffect, useState, useContext } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Stack,  
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
import { GetChadavaByID } from "../../services/GetChadavaByID";

// import { Box, Grid, CardTypography, Button, IconButton, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import OfferChadhavaButton from "./OfferChadhavaButton";
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

export default function ChadhavaDetails({ user }) {
  const navigate = useNavigate();
  const { name, id } = useParams();
  const { language } = useContext(LanguageContext);
  const [poojaData, setPoojaData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [cart, setCart] = useState({ default: 1 });

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser?.role || "user";
  // Total amount calculation including default chadhava price + items
  const totalAmount =
    (cart.default ? poojaData?.chadhava * cart.default : poojaData.chadhava) +
    Object.entries(cart).reduce((sum, [id, count]) => {
      if (id === "default") return sum; // skip default already included
      const item = poojaData.items.find((i) => i._id === id);
      return item ? sum + item.price * count : sum;
    }, 0);

  useEffect(() => {
    const getPooja = async () => {
      const res = await GetChadavaByID(id);
      // const language = language === "hi" ? "Hi" : "";

      const pickLang = (obj, base) =>
        obj?.[`${base}${language}`] ?? obj?.[base];

      const filtered = {
        ...res,
        title: pickLang(res, "title"),
        subtitle: pickLang(res, "subtitle"),
        location: pickLang(res, "location"),
        images:
          language === "Hi" &&
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

  console.log("poojadata", poojaData);

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

  const handleHidePooja = async (id) => {
    handleMenuClose();
    await HidePoojaAPI("/chadhavas/delete", id);
  };

  if (!poojaData) return null;
  const ScrollingNotice = ({ language }) => {
    return (
      <Box
        sx={{
          padding: "10spx",
          backgroundColor: "#f5f5f5", // professional light background
          borderRadius: "8px",
          overflow: "hidden", // hide overflow for animation
          position: "relative",
          height: "40px", // fixed height for smooth animation
          display: "flex",
          alignItems: "center",
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
          <strong style={{ color: "#cd5200" }}>1870+ </strong>
          {language === "hi"
            ? "भक्तों ने देव योगम के माध्यम से चढ़ावा बुक किया"
            : "Devotees booked Chadhava with Dev Yogam"}
        </Typography>
      </Box>
    );
  };
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
                  {language === "hi"
                    ? poojaData?.images_hi?.map((img, idx) => (
                        <div key={img._id || idx}>
                          <img
                            src={img.url}
                            alt={`slide-${idx}`}
                            style={{ borderRadius: 12 }}
                          />
                        </div>
                      ))
                    : poojaData?.images?.map((img, idx) => (
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
                      {language === "hi"
                        ? poojaData?.titleHi
                        : poojaData?.title}
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
                                `${window?.location?.origin}/chadhava/edit/${id}`
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
                    {language === "hi"
                      ? poojaData?.subtitleHi
                      : poojaData.subtitle}
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
                    {poojaData.mandir}
                  </Typography>
                  {/* <Typography
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
                  </Typography> */}
                  <hr style={{ marginTop: "2%", opacity: "70%" }} />
                  {/* <Box
                    sx={{
                      padding: "12px",
                      backgroundColor: "lightgrey",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: "1rem",
                        fontWeight: 500,
                        // marginTop: "2%",
                        color: "#79245a",
                      }}
                    >
                      <strong style={{ color: "#cd5200" }}>1870+ </strong>
                      {language === "hi"
                        ? "भक्तों ने देव योगम के माध्यम से चढ़ावा बुक किया"
                        : "Devotees booked Chadhava with Dev Yogam"}
                    </Typography>
                  </Box> */}
                  <ScrollingNotice language={language} />

                  <Box
                    sx={{
                      width: "100%",
                      marginTop: "2%",
                      display: "flex",
                      alignItems: "end",
                    }}
                  >
                    <OfferChadhavaButton
                      buttonStyle={{
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
                      language={language}
                      amount={poojaData?.chadhava} // from your cart calculation
                      poojaId={poojaData?._id} // pooja id from your params or data
                    />

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
          <Box sx={{ mt: 5, width: "90%", display: "block", mx: "auto" }}>
            <MultiLingualItemList
              poojaData={poojaData}
              language={language}
              cart={cart}
              setCart={setCart}
            />
          </Box>

          <Box sx={{ mt: 5, width: "90%", mx: "auto" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
                fontFamily: "Poppins",
                fontSize: { xs: "1.5rem", md: "2rem", lg: "2rem" },
                color: "#cd5200",
                textAlign: "start",
              }}
            >
              {language === "hi"
                ? "चढ़ावा अर्पित करने से जुडी जानकारी "
                : "Chadhava Details "}
            </Typography>

            <Typography
              sx={{
                mb: 1,
                fontFamily: "Poppins",
                lineHeight: 1.5,
                color: "#79245a",
                fontSize: "1.2rem",
                fontWeight: 600,
              }}
            >
              {language === "hi" ? poojaData?.desc_hi : poojaData?.desc}
            </Typography>
          </Box>

          <Box sx={{ mt: 5, width: "90%", mx: "auto" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ProcessSteps type="chadhava" language={language} />
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
                      {language === "hi" ? item?.titleHi : item?.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        mb: 2,
                        fontFamily: "Poppins",
                        color: "#444",
                      }}
                    >
                      {language === "hi"
                        ? item?.descriptionHi
                        : item?.description}
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
                          {language === "hi"
                            ? item?.questionHi
                            : item?.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 3, py: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "pre-line", fontFamily: "Poppins" }}
                        >
                          {language === "hi" ? item?.answerHi : item?.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                ))}
              </Box>
            )}
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
            <Box
              sx={{
                display: { xs: "flex", sm: "block" },
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ color: "#444", fontWeight: 600 }}
              >
                {language === "en"
                  ? `${Object.keys(cart).length} Offering${
                      Object.keys(cart).length > 1 ? "s" : ""
                    }`
                  : `${Object.keys(cart).length} चढ़ावे`}
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#8e5ff3", fontWeight: 700, mt: 0.5 }}
              >
                ₹{totalAmount}
              </Typography>
            </Box>
            <OfferChadhavaButton
              language={language}
              amount={totalAmount}
              poojaId={poojaData?._id}
              buttonStyle={{
                bgcolor: "#89255b",
                color: "#fff",
                fontWeight: 700,
                textTransform: "none",
                fontFamily: "'Poppins', sans-serif",
                borderRadius: 2,
                px: 4,
                py: 1.2,
                boxShadow: "0 4px 12px rgba(142,95,243,0.4)",
                "&:hover": {
                  bgcolor: "#7323d3",
                  boxShadow: "0 6px 16px rgba(115,35,211,0.6)",
                },
              }}
            />

            {/* <Button
          variant="contained"
          sx={{
            bgcolor: "#89255b",
            color: "#fff",
            fontWeight: 700,
            textTransform: "none",
            fontFamily: "'Poppins', sans-serif",
            borderRadius: 2,
            px: 4,
            py: 1.2,
            boxShadow: "0 4px 12px rgba(142,95,243,0.4)",
            "&:hover": {
              bgcolor: "#7323d3", // slightly darker on hover
              boxShadow: "0 6px 16px rgba(115,35,211,0.6)",
            },
          }}
          onClick={() => {
            // Add your CTA button handler logic here
          }}
        >
          {language === "hi" ? "चढ़ावा अर्पित करें" : "Offer Chadhava"}
        </Button> */}
          </Box>
        </Box>
      </Box>
    </GlobalCssStyles>
  );
}

const MultiLingualItemList = ({ poojaData, language, cart, setCart }) => {
  // Handle adding item count
  const handleAdd = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));

  // Handle removing item count
  const handleRemove = (id) =>
    setCart((c) => {
      const val = (c[id] || 0) - 1;
      const next = { ...c };
      if (val > 0) next[id] = val;
      else delete next[id];
      return next;
    });

  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: 600, fontFamily: "Poppins", color: "#89255b" }}
      >
        {language === "en"
          ? "List of all available offerings in this temple"
          : "मंदिर में सभी उपलब्ध चढ़ावे"}
      </Typography>
      <Grid container spacing={2}>
        {poojaData?.items?.map((item) => (
          <Grid
            item
            size={{ xs: 12, sm: 6, lg: 6, md: 6 }}
            xs={12}
            sm={6}
            md={4}
            key={item._id}
          >
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 2,
                flexDirection: { xs: "column", sm: "row" },
                boxShadow: "0 10px 16px #00000030",
              }}
            >
              <CardMedia
                component="img"
                image={item.image?.url}
                alt={language === "hi" ? item.titleHi : item.title}
                sx={{
                  width: { xs: "100%", sm: 70 }, // full width on mobile
                  height: { xs: 150, sm: 70 }, // taller image on mobile
                  objectFit: "contain",
                  mb: { xs: 1, sm: 0 }, // spacing below image on mobile
                  mr: { xs: 0, sm: 2 },
                  borderRadius: 2,
                  background: "#fafafa",
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <CardContent sx={{ p: 0 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, fontFamily: "Poppins" }}
                  >
                    {language === "hi" ? item.titleHi : item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", fontFamily: "Poppins" }}
                  >
                    {language === "hi" ? item.descriptionHi : item.description}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ mt: 1, fontFamily: "Poppins" }}
                  >
                    ₹{item.price}
                  </Typography>
                </CardContent>
              </Box>
              {/* Add to cart controls */}
              {cart[item._id] ? (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ ml: 2 }}
                >
                  <IconButton
                    onClick={() => handleRemove(item._id)}
                    size="small"
                    color="secondary"
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{cart[item._id]}</Typography>
                  <IconButton
                    onClick={() => handleAdd(item._id)}
                    size="small"
                    color="secondary"
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>
              ) : (
                <Button
                  onClick={() => handleAdd(item._id)}
                  variant="contained"
                  sx={{
                    ml: 2,
                    minWidth: 80,
                    background: "#8e5ff3",
                    fontFamily: "Poppins",
                    borderRadius: "0.5rem",
                  }}
                >
                  {language === "en" ? "+ Add" : "+ जोड़ें"}
                </Button>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
