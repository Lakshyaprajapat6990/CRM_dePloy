import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { GlobalCssStyles } from "../../style/GlobalCSS";
import { useNavigate } from "react-router-dom";
import PujaCard from "../../component/PoojaCard";
import { GetAllPoojasAPI } from "../../services/GetAllPoojasAPI";
import { LanguageContext } from "../../context/LanguageContext";

export default function Pooja() {
  const navigate = useNavigate();
  const [poojaData, setPoojaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useContext(LanguageContext);

  // ✅ Get user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser?.role || "user";

  const getPooja = async () => {
    setLoading(true);
    const res = await GetAllPoojasAPI();

    // Map data based on language
    const filtered = await res?.map((p) => {
      const lang = language === "hi" ? "Hi" : "";

      // Helper to pick lang field or fallback
      const pickLang = (obj, base) => obj?.[`${base}${lang}`] ?? obj?.[base];

      // Map price array
      const price = Array.isArray(p.price)
        ? p.price.map((pr) => ({
            single: {
              ...pr.single,
              description: pickLang(pr.single, "description"),
            },
            couple: {
              ...pr.couple,
              description: pickLang(pr.couple, "description"),
            },
            family: {
              ...pr.family,
              description: pickLang(pr.family, "description"),
            },
            _id: pr._id,
          }))
        : [];

      // Map benefit array
      const benefit = Array.isArray(p.benefit)
        ? p.benefit.map((b) => ({
            ...b,
            title: pickLang(b, "title"),
            description: pickLang(b, "description"),
          }))
        : [];

      // Map faq
      const faq = Array.isArray(p.faq)
        ? p.faq.map((f) => ({
            ...f,
            question: pickLang(f, "question"),
            answer: pickLang(f, "answer"),
          }))
        : [];

      // Map images
      const images =
        language === "hi" &&
        Array.isArray(p.images_hi) &&
        p.images_hi.length > 0
          ? p.images_hi
          : p.images;

      return {
        ...p,
        title: pickLang(p, "title"),
        subtitle: pickLang(p, "subtitle"),
        location: pickLang(p, "location"),
        images,
        price,
        benefit,
        faq,
      };
    });

    setPoojaData(filtered);
    setLoading(false);
  };

  useEffect(() => {
    getPooja();
  }, []);

  const handeNavigate = (id, name) => {
    if (!name) return;
    let s = name.split(" ").join("-");
    navigate(`/pooja-details/${s}/${id}`);
  };

  // Skeleton UI
  const skeletons = Array.from(new Array(6)).map((_, index) => (
    <Grid
      item
      key={index}
      xs={12}
      sm={6}
      md={4}
      size={{ xs: 12, sm: 6, md: 4, lg: 4 }}
    >
      <Card
        sx={{
          width: "100%",
          border: "1px solid #D9D9D9",
          borderRadius: 2,
          boxShadow: "none",
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height={160}
          sx={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        />
        <CardContent sx={{ p: 2 }}>
          <Skeleton variant="text" width="60%" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={25} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="95%" height={20} sx={{ mb: 2 }} />
          <Box display="flex" justifyContent="flex-end">
            <Skeleton
              variant="rectangular"
              width={120}
              height={36}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ));

  const visiblePoojas =
    userRole === "admin"
      ? poojaData
      : poojaData.filter((item) => !item.isDeleted);
  return (
    <GlobalCssStyles>
      <Box sx={{ padding: "2%", width: "90%", margin: "auto" }}>
        <Box className="heading-container">
          <Typography className="heading-text">
            {language === "hi" ? "पूजा सुची" : "Pooja List"}
          </Typography>
          {userRole === "admin" && (
            <Button
              className="create-btn"
              onClick={() => {
                window.open(`${window?.location?.origin}/pooja/create`);
              }}
            >
              Add Pooja
            </Button>
          )}
        </Box>

        {/* Pooja List */}
        <Grid container spacing={2}>
          {loading ? (
            skeletons
          ) : visiblePoojas.length > 0 ? (
            visiblePoojas.map((item, index) => (
              <Grid
                item
                key={index}
                size={{ xs: 12, sm: 6, md: 4, lg: 4 }}
                xs={12}
                sm={6}
                md={4}
                lg={4}
              >
                <Box sx={{ p: 1 }}>
                  <PujaCard
                    user={storedUser}
                    isDeleted={item?.isDeleted}
                    bannerImg={
                      language === "hi"
                        ? item?.images_hi?.[0]?.url
                        : item?.images?.[0]?.url
                    }
                    badge={
                      language === "hi"
                        ? item?.badgeHi || item?.badge
                        : item?.badge
                    }
                    date={item?.capDate}
                    dateBg={item?.dateBg || "#FFD700"}
                    headingHi={item?.titleHi}
                    heading={language === "hi" ? item?.titleHi : item?.title}
                    highlight={
                      language === "hi"
                        ? item?.subtitleHi || item?.subtitle
                        : item?.subtitle
                    }
                    highlightColor={item?.highlightColor || "#ED6A12"}
                    location={
                      language === "hi"
                        ? item?.locationHi || item?.location
                        : item?.location
                    }
                    ctaText={
                      language === "hi"
                        ? item?.ctaTextHi || item?.ctaText || "पूजा में भाग लेवे"
                        : item?.ctaText || "Participate Now"
                    }
                    ctaColor={item?.ctaColor || "#ED6A12"}
                    onCtaClick={() => handeNavigate(item?._id, item?.title)}
                  />
                </Box>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography sx={{ fontFamily: "Poppins", textAlign: "center" }}>
                No Pooja Found
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </GlobalCssStyles>
  );
}
