import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { GetAllTempleAPI } from "../../services/GetAllTempleAPI";
import { Carousel } from "react-responsive-carousel";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Grid, Skeleton } from "@mui/material";
import temple1 from "../../assests/temple 1.png";
import temple2 from "../../assests/temple2.png";
import { LanguageContext } from "../../context/LanguageContext";

export default function ExploreTemples() {
  const [templeData, setTempleData] = useState([]);
  const { language } = useContext(LanguageContext);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const getTemple = async () => {
    setLoading(true);
    try {
      const res = await GetAllTempleAPI();
      setTempleData(res);
    } catch (error) {
      console.error("Error fetching temple data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTemple();
  }, []);

  const defaultImages = [temple1, temple2];

  const carouselItems =
    Array.isArray(templeData) &&
    templeData
      ?.map((temple, index) => {
        let imageUrl = null;
        if (temple?.images && temple.images.length > 0) {
          imageUrl =
            typeof temple.images[0] === "string"
              ? temple.images[0]
              : temple.images[0]?.url;
        } else {
          imageUrl = defaultImages[index % defaultImages.length];
        }
        return {
          image: imageUrl,
          title: temple?.title || "Temple",
          description: temple?.location || "",
        };
      });

  const reversedItems =
    Array.isArray(carouselItems) && [...carouselItems].reverse();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const skeletons = Array.from(new Array(2)).map((_, index) => (
    <Grid item key={index} size={{ xs: 12, md: 4, sm: 6, lg: 4 }}>
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
          height={120}
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
    <Box sx={{ width: "88%", maxWidth: 1300, mx: "auto", my: 5 }}>
      <Typography
        sx={{
          fontFamily: "Poppins",
          fontSize: "2rem",
          fontWeight: 600,
          mb: 4,
          textAlign: "center",
          color: "#cd5200",
        }}
      >
        {language === "hi" ? "प्राचीन मंदिरों के दर्शन करें" : "Explore Temples"}
      </Typography>

      {loading ? (
        <Grid container spacing={2} justifyContent={"center"}>
          {skeletons}
        </Grid>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: "center",
            gap: "1rem",
            cursor: "pointer",
          }}
        >
          <CustomCarousel
            items={
              carouselItems?.length > 0
                ? carouselItems
                : [
                    {
                      image: temple1,
                      title: "Baglamukhi Mata Temple",
                      description: "",
                    },
                  ]
            }
            showStatus={false}
            showArrows={true}
            showIndicators={false}
            showThumbs={false}
          />
          <Box
            sx={{
              width: isSmallScreen ? "100%" : "auto",
            }}
          >
            <CustomCarousel
              items={
                reversedItems?.length > 0
                  ? reversedItems
                  : [
                      {
                        image: temple2,
                        title: "Mahakal Temple",
                        description: "",
                      },
                    ]
              }
              showStatus={false}
              showIndicators={false}
              showThumbs={false}
              showArrows={false}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

const CustomCarousel = ({
  items = [],
  carouselProps = {},
  showStatus = false,
  showIndicators = false,
  showThumbs = false,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  let carouselHeight = "40vh";
  if (isSmallScreen) {
    carouselHeight = "30vh";
  } else if (isMediumScreen) {
    carouselHeight = "35vh";
  }
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));

  let arrowSize = 40;
  let fontSize = "1.5rem";
  let topPosition = "50%";
  if (isXs) {
    arrowSize = 24;
    fontSize = "1rem";
    topPosition = "50%";
  } else if (isSm) {
    arrowSize = 30;
    fontSize = "1.2rem";
    topPosition = "50%";
  }

  return (
    <Carousel
      showArrows={true}
      showIndicators={showIndicators}
      showThumbs={showThumbs}
      infiniteLoop
      autoPlay
      interval={3500}
      stopOnHover
      swipeable
      emulateTouch
      dynamicHeight={false}
      showStatus={showStatus}
      renderArrowPrev={(onClickHandler, hasPrev, label) =>
        hasPrev && (
          <button
            type="button"
            onClick={onClickHandler}
            title={label}
            style={{
              position: "absolute",
              zIndex: 2,
              top: topPosition,
              left: 15,
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: arrowSize,
              height: arrowSize,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: fontSize,
              opacity: 0.3,
            }}
          >
            ❮
          </button>
        )
      }
      renderArrowNext={(onClickHandler, hasNext, label) =>
        hasNext && (
          <button
            type="button"
            onClick={onClickHandler}
            title={label}
            style={{
              position: "absolute",
              zIndex: 2,
              top: topPosition,
              right: 15,
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: arrowSize,
              height: arrowSize,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: fontSize,
              opacity: 0.3,
            }}
          >
            ❯
          </button>
        )
      }
      {...carouselProps}
    >
      {Array.isArray(items) &&
        items?.map((item, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              width: "100%",
              height: carouselHeight,
              maxHeight: 400,
              minHeight: 200,
              padding: 10,
              overflow: "hidden",
              boxSizing: "border-box",
            }}
            onClick={() => {
              navigate("/temple");
            }}
          >
            <img
              src={item.image}
              alt={item.title || "Temple"}
              style={{
                width: "auto",
                maxWidth: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
                display: "block",
                borderRadius: "12px",
                margin: "0 auto",
              }}
            />
          </div>
        ))}
    </Carousel>
  );
};
