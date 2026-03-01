import React, { useEffect, useState, useContext } from "react";
import { GlobalCssStyles } from "../../style/GlobalCSS";
import {
  Box,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  Skeleton,
} from "@mui/material";
import { GetAllChadhavaAPI } from "../../services/GetAllChadhavaAPI";
import PujaCard from "../../component/PoojaCard";
import chadhava from "../../assests/chadava.png";
import { LanguageContext } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function Chadhava({ user }) {
  const navigate = useNavigate();
  const [chadhavaData, setChadhavaData] = useState([]);
  const [loading, setLoading] = useState(true); // loading state added
  const { language } = useContext(LanguageContext);

  const getChadhava = async () => {
    setLoading(true);
    try {
      const res = await GetAllChadhavaAPI();

      const lang = language === "hi" ? "Hi" : "";

      const pickLang = (obj, base) => obj?.[`${base}${lang}`] ?? obj?.[base];

      const filteredData = Array.isArray(res)
        ? res?.map((item) => ({
            ...item,
            title: Array.isArray(item.title)
              ? [
                  pickLang(
                    { title: item.title[0], titleHi: item.titleHi?.[0] },
                    "title"
                  ),
                ]
              : pickLang(item, "title"),
            subtitle: pickLang(item, "subtitle"),
            desc: pickLang(item, "desc"),
            items: Array.isArray(item.items)
              ? item.items.map((it) => ({
                  ...it,
                  title: pickLang(it, "title"),
                }))
              : [],
          }))
        : [];

      setChadhavaData(filteredData);
    } catch (error) {
      console.error("Failed to fetch Chadhava data:", error);
      setChadhavaData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChadhava();
  }, [language]);
  const handeNavigate = (id, name) => {
    const safeName =
      typeof name === "string" && name.length > 0
        ? name.split(" ").join("-")
        : String(name ?? "");

    navigate(`/chadhava-details/${safeName}/${id}`);
  };

  const safeChadhavaData =
    Array.isArray(chadhavaData) && chadhavaData.length > 0
      ? chadhavaData
      : [
          {
            _id: "fallback",
            title: ["Chadava Feature Coming Soon"],
            subtitle: "We offer various chadhava options",
            desc: "Details will be updated soon.",
            createdAt: new Date().toISOString(),
            items: [
              {
                image: chadhava,
                title: "Default Item",
                price: 0,
              },
            ],
          },
        ];

  // Skeleton UI to show when loading
  const skeletons = Array.from(new Array(6)).map((_, index) => (
    <Grid
      item
      key={index}
      xs={12}
      sm={6}
      md={4}
      lg={3}
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

  return (
    <GlobalCssStyles>
      <Box sx={{ width: "90%", margin: "auto", padding: "2%" }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {user?.role === "admin" && (
            <Button
              className="create-btn"
              onClick={() => {
                window.open(`${window?.location?.origin}/chadhava/create`);
              }}
            >
              {language === "hi" ? "चढ़ावा जोड़ें" : "Add Chadhava"}
            </Button>
          )}
        </Box>

        <Grid container spacing={2} justifyContent="center">
          {loading
            ? skeletons
            : safeChadhavaData.map((item) => {
                const firstItem = item.items?.[0] || {};

                const bannerImg =
                  (language === "hi" && item.images_hi?.[0]?.url) ||
                  item.images?.[0]?.url ||
                  firstItem.image?.url ||
                  chadhava;

                const displayTitle = item?.title;
                return (
                  <Grid
                    key={item._id}
                    item
                    size={{ xs: 12, sm: 6, md: 4, lg: 4 }}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                  >
                    <PujaCard
                      bannerImg={bannerImg}
                      // date={item.createdAt || new Date().toISOString()}
                      heading={item?.title || "Chadhava"}
                      highlight={item?.subtitle || ""}
                      highlightColor="#7c3aed"
                      location={`${item?.mandir || 0}`}
                      ctaText={
                        language === "hi" ? "चढ़ावा अर्पित करें" : "Contribute"
                      }
                      onCtaClick={() => handeNavigate(item?._id, item?.title)}
                    />
                  </Grid>
                );
              })}
        </Grid>
      </Box>
    </GlobalCssStyles>
  );
}
