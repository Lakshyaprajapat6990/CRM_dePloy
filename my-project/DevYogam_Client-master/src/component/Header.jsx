import React, { useState, useEffect, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme, styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import logo from "../assests/logo.png";
import LoginModal from "./LoginModal";
import { Switch } from "@mui/material";
import { LanguageContext } from "../context/LanguageContext";
import { motion } from "framer-motion";

const user = JSON?.parse(localStorage.getItem("user"));

const AnimatedDrawer = ({ open, onClose, children }) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 280, overflow: "hidden", background: "white" },
      }}
    >
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative", // ✅ ensure stacking
        }}
      >
        {children}
      </motion.div>
    </Drawer>
  );
};

const navItemsLeft = [
  { label: "Home", labelHi: "होम", link: "/", linkHi: "/hi/" },
  { label: "Pooja", labelHi: "पूजा", link: "/pooja", linkHi: "/hi/pooja" },
];
const navItemsRight = [
  {
    label: "Chadava",
    labelHi: "चढ़ावा",
    link: "/chadhava",
    linkHi: "/hi/chadhava",
  },
  { label: "Temples", labelHi: "मंदिर", link: "/temple", linkHi: "/hi/temple" },
];
const moreOptions =
  user?.role === "admin"
    ? [
        { label: "Login", labelHi: "लॉग इन" },
        {
          label: "Contact Us",
          link: "/contact",
          labelHi: "संपर्क करे",
          linkHi: "/hi/contact",
        },
        {
          label: "Payment History",
          labelHi: "भुगतान इतिहास",
          link: "/payment-history",
        },
        {
          label: "CRM Dashboard",
          labelHi: "CRM डैशबोर्ड",
          link: "/crm/dashboard",
        },
        {
          label: "CRM Contacts",
          labelHi: "CRM संपर्क",
          link: "/crm/contacts",
        },
      ]
    : [
        { label: "Login", labelHi: "लॉग इन" },
        {
          label: "Contact Us",
          link: "/contact",
          labelHi: "संपर्क करे",
          linkHi: "/hi/contact",
        },
      ];
const NavButton = styled(Button)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "1rem",
  fontFamily: "Poppins, sans-serif",
  letterSpacing: 1,
  color: "#333",
  textTransform: "none",
  position: "relative",
  "&:hover": {
    color: "#aa4466",
    background: "transparent",
    "&::after": {
      width: "100%",
    },
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 2,
    width: 0,
    backgroundColor: "#aa4466",
    transition: "width 0.3s ease",
    borderRadius: 2,
  },
}));

export default function Header() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const trigger = useScrollTrigger({ threshold: 10 });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const getNavItemsByLanguage = (items, lang) =>
    items.map((item) => ({
      ...item,
      label: lang === "hi" ? item.labelHi || item.label : item.label,
      link: lang === "hi" ? item.linkHi || item.link : item.link,
    }));

  const leftNav = getNavItemsByLanguage(navItemsLeft, language);
  const rightNav = getNavItemsByLanguage(navItemsRight, language);
  const moreNav = getNavItemsByLanguage(moreOptions, language);
  const LanguageSwitch = styled(Switch)(({ theme }) => ({
    width: 70,
    height: 32,
    padding: 0,
    display: "flex",

    "& .MuiSwitch-switchBase": {
      padding: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(38px)",
        color: "#fff",
        "& .MuiSwitch-thumb::before": {
          content: '"हि"',
        },
        "& + .MuiSwitch-track": {
          backgroundColor: "#89255b",
          opacity: 1,
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "none",
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: "#fff",
      position: "relative",
      "&::before": {
        content: '"EN"',
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: 12,
        fontFamily: "Poppins",
        fontWeight: 700,
        color: "#89255b",
      },
    },
    "& .MuiSwitch-track": {
      borderRadius: 16,
      backgroundColor: "#89255b",
      opacity: 1,
      "&::after": {
        content: '"हि"',
        position: "absolute",
        top: "50%",
        right: 10,
        transform: "translateY(-50%)",
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "Poppins",
        color: "#fff",
      },
      "&::before": {
        content: '"EN"',
        position: "absolute",
        top: "50%",
        left: 10,
        transform: "translateY(-50%)",
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "Poppins",
        color: "#fff",
      },
    },

    // ✅ Responsive adjustments
    [theme.breakpoints.down("sm")]: {
      width: 50,
      height: 26,
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(24px)",
      },
      "& .MuiSwitch-thumb": {
        width: 20,
        height: 20,
        "&::before": {
          fontSize: 10,
        },
      },
      "& .MuiSwitch-track": {
        "&::before, &::after": {
          fontSize: 10,
        },
        "&::before": { left: 6 },
        "&::after": { right: 6 },
      },
    },
  }));

  const drawerList = (
    <Box
      sx={{ width: 260, py: 2, bgcolor: "background.paper", height: "100%" }}
      role="presentation"
      onKeyDown={() => setDrawerOpen(false)}
    >
      <IconButton
        onClick={() => setDrawerOpen(false)}
        sx={{
          color: "#aa4466",
          width: 40,
          height: 40,
          cursor: "pointer",
          alignSelf: "flex-start",
          mr: 1,
          mt: 1,
          zIndex: 10,
        }}
        aria-label="close drawer"
      >
        <CloseIcon />
      </IconButton>

      <List sx={{ pt: 3 }}>
        {[...leftNav, ...rightNav, ...moreNav].map((item, idx) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component="a"
              href={item.link || "#"}
              onClick={(e) => {
                if (
                  item?.label?.toLowerCase() === "login" ||
                  item?.label === "लॉग इन"
                ) {
                  e.preventDefault();
                  setDrawerOpen(false);
                  setLoginOpen(true);
                }
              }}
              sx={{
                "&.Mui-focusVisible, &:hover": {
                  bgcolor: alpha("#aa4466", 0.15),
                  color: "#aa4466",
                },
                transition: "background-color 0.25s ease, color 0.25s ease",
                ml: 1,
                borderRadius: 1,
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "white",
          py: 1,
          boxShadow: trigger ? "0 2px 15px rgba(0,0,0,0.1)" : "none",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: "45px", md: "64px", lg: "72px" },
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, md: 4 },
          }}
        >
          {/* Left Navs or Hamburger */}
          {!isMobile ? (
            <Box sx={{ display: "flex", gap: 3 }}>
              {leftNav?.map((item) => (
                <NavButton key={item.label} href={item.link}>
                  {item.label}
                </NavButton>
              ))}
            </Box>
          ) : (
            <IconButton
              size="large"
              edge="start"
              aria-label={drawerOpen ? "close menu" : "open menu"}
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{ color: "#aa4466" }}
            >
              {drawerOpen ? (
                <CloseIcon sx={{ fontSize: 32 }} />
              ) : (
                <MenuIcon sx={{ fontSize: 32 }} />
              )}
            </IconButton>
          )}

          {/* Centered Logo */}
          <Box
            sx={{
              left: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <Box
              component="img"
              src={logo}
              loading="lazy"
              sx={{
                width: { xs: 140, sm: 180, md: 220, lg: 240 },
                height: "auto",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            />
          </Box>
          {isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                ml: 2,
              }}
            >
              <LanguageSwitch
                checked={language === "hi"}
                onChange={toggleLanguage}
                inputProps={{ "aria-label": "language switch" }}
              />
            </Box>
          )}

          {/* Right Navs + More */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {rightNav.map((item) => (
                <NavButton key={item.label} href={item.link}>
                  {item.label}
                </NavButton>
              ))}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  ml: 2,
                }}
              >
                <LanguageSwitch
                  checked={language === "hi"}
                  onChange={toggleLanguage}
                  inputProps={{ "aria-label": "language switch" }}
                />
              </Box>
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
                {moreNav.map((option) => (
                  <MenuItem
                    key={option.label}
                    onClick={() => {
                      handleMenuClose();
                      if (option.label.toLowerCase() === "login") {
                        setLoginOpen(true);
                      } else if (option.link) {
                        navigate(option.link);
                      }
                    }}
                    sx={{
                      fontFamily: "Poppins",
                      transition: "background-color 0.3s, color 0.3s",
                      "&:hover": {
                        backgroundColor: alpha("#aa4466", 0.1),
                        color: "#aa4466",
                      },
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
        <AnimatedDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          {drawerList}
        </AnimatedDrawer>
      </AppBar>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={(values) => {
          console.log("Login form submitted with", values);
          // Add your login logic here
          setLoginOpen(false);
        }}
      />
    </>
  );
}
