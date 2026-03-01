import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactPixel from "react-facebook-pixel";
import { trackPageView } from "../services/BehaviorTrackingAPI";

function RouteChangeTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track for Facebook Pixel
    ReactPixel.pageView();
    
    // Track for our CRM behavior tracking system
    const pagePath = location.pathname;
    trackPageView(pagePath).catch(err => {
      // Silently fail - don't break the app
      console.log("Page view tracked:", pagePath);
    });
  }, [location]);

  return null;
}

export default RouteChangeTracker;
