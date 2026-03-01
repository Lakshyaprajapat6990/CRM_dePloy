import React, { useContext } from "react";
import CustomCarousel from "../../component/CustomCarousel";
import OurServices from "./OurServices";
import ExploreTemples from "./ExploreTemples";
import ReviewSection from "./ReviewSection";
import img2 from "../../assests/banner1.webp";
import bannerhi from "../../assests/dyhi.webp";
import img1 from "../../assests/1.png";
import { LanguageContext } from "../../context/LanguageContext";

export default function Home() {
  const { language } = useContext(LanguageContext);
  const slides = [
    {
      image: language === "hi" ? bannerhi : img2,
      title: "Spiritual Pooja Services",
      description: "Book sacred rituals online anytime.",
    },
    {
      image: language === "hi" ? bannerhi : img2,
      title: "Spiritual Pooja Services",
      description: "Book sacred rituals online anytime.",
    },
    {
      image: language === "hi" ? bannerhi : img2,
      title: "Visit Mandir",
      description: "Explore famous temples and holy places.",
    },
  ];

  return (
    <div style={{ marginTop: "1%" }}>
      <CustomCarousel items={slides} />
      <OurServices />
      <ExploreTemples />
      <ReviewSection />
    </div>
  );
}
