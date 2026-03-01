import { useTheme } from "@mui/material/styles";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function CustomCarousel({ items = [], carouselProps = {} }) {
  const theme = useTheme();
  return (
    <Carousel
      showArrows={false}
      showIndicators={false}
      showThumbs={true}
      showStatus={false}
      infiniteLoop
      autoPlay
      interval={3500}
      stopOnHover
      swipeable
      emulateTouch
      dynamicHeight={false}
      {...carouselProps}
    >
      {items.map((item, idx) => (
        <>
          <div
            key={idx}
            style={{
              position: "relative",
              width: "100%",
              // width: "20vw",
              height: "20vh",
              maxHeight: 600,
              minHeight: 250,
              overflow: "hidden",
              boxShadow: "",
            }}
          >
            <img
              src={item.image}
              alt="Banner"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
            {/* <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.33) 0%, rgba(0,0,0,0.65) 100%)",
                  zIndex: 1,
                }}
              /> */}

            <div
              style={{
                position: "absolute",
                top: "300px",
                left: 0,
                right: 0,
                bottom: 0,
                // marginLeft: "45%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                // color: theme.palette.text.primary, // Use theme primary text color
                textShadow: "0 2px 8px rgba(0,0,0,0.45)",
                zIndex: 2,
              }}
            >
              {(item.title || item.description) && (
                <div
                  className="legend"
                  // style={{ color: theme.palette.primary.main }}
                >
                  <h3
                  //  style={{ color: theme.palette.primary.main }}
                  >
                    {item.title}
                  </h3>
                  <p
                  //  style={{ color: theme.palette.secondary.main }}
                  >
                    {item.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      ))}
    </Carousel>
  );
}
