import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const LanguageContext = createContext({
  language: "en",
  toggleLanguage: () => {},
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Function to update URL path on language toggle
  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === "en" ? "hi" : "en";

      // Parse current path and query
      let path = location.pathname;
      // Remove any trailing slash for consistent behavior
      if (path !== "/" && path.endsWith("/")) path = path.slice(0, -1);

      if (newLang === "hi") {
        // If not already prefixed, add /hi prefix
        if (!path.startsWith("/hi")) {
          const newPath = path === "/" ? "/hi" : `/hi${path}`;
          navigate(newPath + location.search, { replace: true });
        }
      } else {
        // Moving to English: remove /hi prefix if present
        if (path.startsWith("/hi")) {
          const newPath = path === "/hi" ? "/" : path.replace(/^\/hi/, "");
          navigate(newPath + location.search, { replace: true });
        }
      }
      return newLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
