// import React from "react";
// import { Navigate } from "react-router-dom";
// import { getAuthDetails } from "../utils/auth";

// const roleRoutes: { [key: string]: string } = {
//   admin: "/PeopleProfile",
//   user: "/UserProfile",
// };

// const ProtectedRoutes: React.FC = () => {
//   const { token, isAdmin } = getAuthDetails();

//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   const role = isAdmin ? "admin" : "user";
//   const route = roleRoutes[role];
//   // console.log(route, "route");

//   return route ? <Navigate to={route} /> : <Navigate to="/" />;
// };

// export default ProtectedRoutes;

import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

type ProtectedRouteProps = {
  allowedRoles: string[]; // Specify that allowedRoles is an array of strings
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  // console.log(allowedRoles);
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const role = getUserRole();
  // console.log(role, "role");
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
