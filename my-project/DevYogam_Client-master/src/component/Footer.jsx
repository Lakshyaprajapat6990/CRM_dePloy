import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";
import logo from "../assests/logo.png";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
const footerLinks = [
  {
    heading: "Useful Links",
    links: [
      { name: "Home", url: "/" },
      { name: "Pooja", url: "/pooja" },
      { name: "Chadhava", url: "/chadhava" },
      { name: "Temples", url: "/temple" },
      // { name: "DevYogam Mall", url: "#" },
    ],
  },
  {
    heading: "Documents",
    links: [
      { name: "Disclaimers", url: "/disclaimer" },
      { name: "Privacy Policy", url: "/privacy-policy" },
      { name: "Terms & Conditions", url: "/terms-conditions" },
    ],
  },
  {
    heading: "Contact Us",
    links: [{ name: "Contact", url: "/contact" }],
  },
];

const socialLinks = [
  { icon: <FacebookIcon />, url: "https://www.facebook.com/people/Devyogam/61580460080327/" },
  { icon: <InstagramIcon />, url: "https://www.instagram.com/devyogam/" },
  { icon: <YouTubeIcon />, url: "https://www.facebook.com/people/Devyogam/61580460080327/" },
  { icon: <XIcon />, url: "#" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#f8f9fb",
        padding: "40px 0 20px 0",
        color: "#333",
        marginTop: "5rem",
        fontFamily: "Poppins",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          maxWidth: "1200px",
          margin: "auto",
          flexWrap: "wrap",
          width: { xs: "80%", md: "100%", sm: "80%" },
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "24px" }}>
          <img src={logo} alt="DevYogam Logo" style={{ maxWidth: "200px" }} />
        </div>

        {/* Footer links */}
        {footerLinks.map((section) => (
          <div key={section.heading}>
            <h4
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                marginBottom: "14px",
                color: "#888",
                fontFamily: "Poppins",
              }}
            >
              {section.heading}
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {section.links.map((link) => (
                <li key={link.name} style={{ marginBottom: "8px" }}>
                  <Link
                    to={link.url} // ✅ instead of href
                    style={{
                      color: "#222",
                      textDecoration: "none",
                      fontSize: "16px",
                      fontFamily: "Poppins",
                      cursor: "pointer",
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Social / Contact */}
        <div style={{ minWidth: "220px" }}>
          <h4
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              marginBottom: "14px",
              color: "#888",
              fontFamily: "Poppins",
            }}
          >
            Get in touch
          </h4>
          <p
            style={{
              fontSize: "15px",
              marginBottom: "12px",
              color: "#333",
              fontFamily: "Poppins",
            }}
          >
            Connect with us on social media for the latest updates about our
            services.
          </p>
          <div style={{ display: "flex", gap: "15px" }}>
            {socialLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#433f4a",
                  fontSize: "22px",
                  fontFamily: "Poppins",
                }}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </Box>
      <div
        style={{
          borderTop: "1px solid #e3e3e3",
          marginTop: "30px",
          paddingTop: "16px",
          textAlign: "center",
          color: "#aaa",
          fontSize: "14px",
          fontFamily: "Poppins",
        }}
      >
        &copy; {new Date().getFullYear()} DevYogam. All Rights Reserved.
      </div>
    </footer>
  );
}
