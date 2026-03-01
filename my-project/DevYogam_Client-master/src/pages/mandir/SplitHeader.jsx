import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import one from "../../assests/1.png";
import banner from "../../assests/tmplbanner.webp";
import { Button } from "@mui/material";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SplitHeader() {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const smootherRef = useRef(null);
  const spacerRef = useRef(null);

  useEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 2,
      speed: 3,
      effects: true,
    });
    smootherRef.current = smoother;
    smoother.effects(".hero__image-cont", {
      speed: () => gsap.utils.random(0.55, 0.85, 0.05),
    });

    gsap.to(".anim-swipe", {
      yPercent: 300,
      delay: 0.2,
      duration: 3,
      stagger: {
        from: "random",
        each: 0.1,
      },
      ease: "sine.out",
    });

    gsap.to(".hero__image-cont > img", {
      scale: 1.2,
      xPercent: 20,
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "+=3000px",
        scrub: true,
      },
    });

    return () => {
      smoother.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
  const handleExploreClick = () => {
    if (smootherRef.current && spacerRef.current) {
      smootherRef.current.scrollTo(spacerRef.current, true, "top 100");
      gsap.to(".scroll", { opacity: 0, y: 50, duration: 0.6 }); 
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body {
          overscroll-behavior: none;
          padding: 0;
          overflow-x: hidden;
          background-color: white;
        }
        #wrapper {
          height: 80vh;
          overflow: hidden;
        }
        #content {
          overflow: visible;
        }
        .hero {
          height: 100vh;
        }
        .hero__inner {
          height: 100%;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
        }
        .hero__image-cont {
          position: relative;
          overflow: hidden;
        }
        .hero__image-cont:not(:last-child)::after {
          content: "";
          position: absolute;
          right: 0;
          background-color: #111111;
          height: 100%;
          top: 0;
          width: 2.5px;
          z-index: 999;
        }
        .hero__image-cont img, .anim-swipe {
          position: absolute;
          width: 700%;
          height: 100%;
          top: 0;
          left: 0;
          object-fit: cover;
        }
        .hero__image-cont:nth-child(1) img {
          left: -100%;
        }
        .hero__image-cont:nth-child(2) img {
          left: -200%;
        }
        .hero__image-cont:nth-child(3) img {
          left: -300%;
        }
        .hero__image-cont:nth-child(4) img {
          left: -400%;
        }
        .hero__image-cont:nth-child(5) img {
          left: -500%;
        }
        .hero__image-cont:nth-child(6) img {
          left: -600%;
        }
        .anim-swipe {
          width: 100%;
          height: 100%;
          background-color: #11111;
          z-index: 10;
        }
        .spacer {
          height: 180vh;
          background-color:'white
        }
.scroll {
  margin: 2rem auto;
  display: block;
  text-align: center;
}

        .create-btn {
    marginTop: 10px;
    borderRadius: 20px;
    width: fit-content;
    height: 3rem;
    lineHeight: 10px;
    textTransform: none;
    padding: 0px 2%;
    background-color: #9a67e6;
    color: white

    }
      `}</style>

      <div
        id="wrapper"
        ref={wrapperRef}
        style={{
          position: "relative",
          top: "2.8rem",
          height:'100vh'
        }}
      >
        <div id="content" ref={contentRef}>
          <section className="hero">
            <div className="hero__inner constrain">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="hero__image-cont">
                  <img src={banner} alt={`slice ${i}`} style={{ objectFit: "cover", margin:"auto" }} draggable={false} />
                  <div className="anim-swipe" />
                </div>
              ))}
            </div>
          </section>
          <section className="spacer" />
        </div>
      </div>
    </>
  );
}
