import { useContext } from "react";
import { MainContext } from "./context/GeneralContext";
import { Outlet, useLocation, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const location = useLocation();
  const { cookies } = useContext(MainContext);
  return cookies.roomId ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default ProtectedRoutes;
