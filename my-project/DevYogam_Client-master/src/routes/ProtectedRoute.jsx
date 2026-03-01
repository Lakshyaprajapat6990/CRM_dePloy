import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const userStr = localStorage.getItem("user");
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error("Failed to parse user:", e);
  }

  return user?.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
