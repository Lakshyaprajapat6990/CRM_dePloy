import React from "react";
import { Route, Routes } from "react-router";
import Pooja from "../pages/pooja/Pooja";
import Chadhava from "../pages/chadhava/Chadhava";
import Mandir from "../pages/mandir/Mandir";
import Home from "../pages/home/Home";
import AddPooja from "../pages/pooja/AddPooja";
import AddTemple from "../pages/mandir/AddTemple";
import PrivacyPolicy from "../pages/policies/PrivacyPolicy";
import Disclamer from "../pages/policies/Disclaimer";
import TermsAndConditions from "../pages/policies/TermsAndConditions";
import AddChadhava from "../pages/chadhava/AddChadhava";
import PoojaDetails from "../pages/pooja/PoojaDetails";
import PujaBookingPage from "../pages/pooja/PujaBookingPage";
import RazorpayCheckout from "../component/RazorpayCheckout";
import ProtectedRoute from "./ProtectedRoute";
import EditPooja from "../pages/pooja/EditPooja";
import ContactUs from "../pages/contact-us/ContactUs";
import ChadhavaDetails from "../pages/chadhava/ChadhavaDetails";
import PaymentHistory from "../pages/payment-history/PaymentHistory";
import RouteChangeTracker from "./RouteChangeTracker";
import MandirDetails from "../pages/mandir/MandirDetails";
import EditChadhava from "../pages/chadhava/EditChadhava";

export default function PublicRoutes({ user }) {
  return (
    <>
      <RouteChangeTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hi/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/hi/contact" element={<ContactUs />} />
        <Route path="/pooja" element={<Pooja user={user} />} />
        <Route path="/hi/pooja" element={<Pooja user={user} />} />

        <Route element={<ProtectedRoute />}>
          <>
            <Route path="/pooja/create" element={<AddPooja />} />
            <Route path="/pooja/edit/:id" element={<EditPooja />} />
            <Route path="/temple/create" element={<AddTemple />} />
            <Route path="/chadhava/create" element={<AddChadhava />} />
            <Route path="/chadhava/edit/:id" element={<EditChadhava />} />
            {/* <Route path="/chadhava/edit/:id" element={<EditChadhava />} /> */}
            <Route path="/payment-history" element={<PaymentHistory />} />
            <Route path="/hi/payment-history" element={<PaymentHistory />} />
          </>
        </Route>
        <Route
          path="/pooja-details/:name/:id"
          element={<PoojaDetails user={user} />}
        />
        <Route
          path="/hi/pooja-details/:name/:id"
          element={<PoojaDetails user={user} />}
        />
        <Route
          path="/pooja-booking/:type/:name/:id"
          element={<PujaBookingPage />}
        />
        <Route
          path="/hi/pooja-booking/:type/:name/:id"
          element={<PujaBookingPage />}
        />
        <Route path="/chadhava" element={<Chadhava user={user} />} />
        <Route path="/hi/chadhava" element={<Chadhava user={user} />} />
        <Route
          path="/chadhava-details/:name/:id"
          element={<ChadhavaDetails user={user} />}
        />
        <Route
          path="/hi/chadhava-details/:name/:id"
          element={<ChadhavaDetails user={user} />}
        />
        <Route path="/temple" element={<Mandir user={user} />} />
        <Route path="/hi/temple" element={<Mandir user={user} />} />
        <Route
          path="/temple-details/:name/:id"
          element={<MandirDetails user={user} />}
        />
        <Route
          path="/hi/temple-details/:name/:id"
          element={<MandirDetails user={user} />}
        />


        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/disclaimer" element={<Disclamer />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
        <Route path="/razorpay" element={<RazorpayCheckout />} />
        {/* You can add more routes here */}
      </Routes>
    </>
  );
}

const navItemsLeft = [
  { label: "Home", link: "#" },
  { label: "Pooja", link: "/pooja" },
];
const navItemsRight = [
  { label: "Chadava", link: "/chadhava" },
  { label: "Mandir", link: "/mandir" },
];
const moreOptions = [
  { label: "Login", link: "/login" },
  // { label: "Crystals", link: "#" },
  { label: "Contact Us", link: "/contact" },
];
