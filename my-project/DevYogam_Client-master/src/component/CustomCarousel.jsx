import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function CustomCarousel({ items = [], carouselProps = {} }) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm")); // <600px
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600-900px
  const isLg = useMediaQuery(theme.breakpoints.up("md")); // >900px

  // Define responsive sizes for arrows
  let arrowSize = 40;
  let fontSize = "1.5rem";
  let topPosition = "50%";
  if (isXs) {
    arrowSize = 24;
    fontSize = "1rem";
    topPosition = "40%";
  } else if (isSm) {
    arrowSize = 30;
    fontSize = "1.2rem";
    topPosition = "45%";
  }

  return (
    <Carousel
      showArrows={true}
      showIndicators={true}
      showThumbs={false}
      showStatus={false}
      infiniteLoop
      autoPlay
      interval={3500}
      stopOnHover
      swipeable
      emulateTouch
      dynamicHeight={false}
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
              opacity: 0.5,
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
              opacity: 0.5,
            }}
          >
            ❯
          </button>
        )
      }
      {...carouselProps}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          style={{
            position: "relative",
            width: "100%",
            height: "auto",
            maxHeight: 600,
            minHeight: 250,
            overflow: "hidden",
          }}
        >
          <img
            src={item.image}
            alt="Banner"
            style={{
              width: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              height: "auto",
              // borderRadius: "12px",
            }}
          />
        </div>
      ))}
    </Carousel>
  );
}
