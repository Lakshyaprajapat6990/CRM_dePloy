import React, { useEffect, useState, useContext } from "react";
import SplitHeader from "./SplitHeader";
import { GlobalCssStyles } from "../../style/GlobalCSS";
import {
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PujaCard from "../../component/PoojaCard";
import temple2 from "../../assests/temple2.png";
import { GetAllTempleAPI } from "../../services/GetAllTempleAPI";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../context/LanguageContext";

export default function Mandir({ user }) {
  const [templeData, setTempleData] = useState([]);
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  // Fetch and prefilter temple data on language or initial load change
  const getTemple = async () => {
    const res = await GetAllTempleAPI();

    const lang = language === "hi" ? "Hi" : "";

    const pickLang = (obj, base) => obj?.[`${base}${lang}`] ?? obj?.[base];

    const filteredData = Array.isArray(res)
      ? res?.map((item) => ({
          ...item,
          title: pickLang(item, "title"),
          location: pickLang(item, "location"),
          subTitle: pickLang(item, "subTitle"),
          templeDescription: pickLang(item, "templeDescription"),
          longDescription: pickLang(item, "longDescription"),
          // Use images_hi in Hindi if available, fallback to images
          images:
            lang === "Hi" && Array.isArray(item.images_hi) && item.images_hi.length > 0
              ? item.images_hi
              : item.images || [],
        }))
      : [];
    setTempleData(filteredData);
  };

  useEffect(() => {
    getTemple();
  }, [language]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // <600px
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600-900px

  const handleNavigate = (id, name) => {
    let s = name.split(" ").join("-");
    navigate(`/temple-details/${s}/${id}`);
  };

  return (
    <GlobalCssStyles>
      <Box className="parent-container">
        {/* Show header only on large screens */}
        {isSmallScreen || isMediumScreen ? null : (
          <Box sx={{ minHeight: "100vh" }}>
            <SplitHeader />
          </Box>
        )}
        <Box sx={{ width: "90%", margin: "auto", padding: "2%" }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", m: 2 }}>
            {user?.role === "admin" && (
              <Button
                className="create-btn"
                onClick={() => {
                  window.open(`${window?.location?.origin}/temple/create`);
                }}
              >
                {language === "hi" ? "मंदिर जोड़ें" : "Add Temple"}
              </Button>
            )}
          </Box>

          <Grid container spacing={2} justifyContent="center">
            {Array.isArray(templeData) && templeData.length > 0 ? (
              templeData.map((item) => (
                <Grid
                  key={item._id}
                  item
                  size={{ xs: 12, sm: 6, md: 4, lg: 4 }}
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                >
                  <Box sx={{ p: 1 }}>
                    <PujaCard
                      bannerImg={item?.images?.[0]?.url || temple2}
                      // date={item?.createdAt}
                      heading={item?.title}
                      highlight={item?.subTitle}
                      location={item?.location}
                      isDeleted={item?.isDeleted}
                      ctaText={language === "hi" ? "मंदिर देखें" : "Explore Temple"}
                      onCtaClick={() => handleNavigate(item?._id, item?.title)}
                      user={user}
                    />
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography
                  sx={{ fontFamily: "Poppins", textAlign: "center", mt: 4 }}
                >
                  {language === "hi" ? "कोई मंदिर नहीं मिला" : "No Temple Found"}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </GlobalCssStyles>
  );
}
