import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import Header from "./Header.jsx";

const RequireAuth = ({ allowedRoles, children }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return (
    auth?.role && Array.isArray(allowedRoles) && allowedRoles.includes(auth.role) ? (
        <>
            {children}
        </>
    ) : auth?.username ? (
      <>
        <Navigate to="/Unauthorized" state={{ from: location }} replace />
      </>
    ) : (
      <Navigate to="/Login" state={{ from: location }} replace />
    )
  );
};

export default RequireAuth;