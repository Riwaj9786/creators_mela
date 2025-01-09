// import React from "react";
// import { Link, Navigate, Outlet } from "react-router-dom";
// // import { useSelector } from "react-redux";
// // import { RootState } from "../app/store";

// const AdminRoutes: React.FC = () => {
//   // const [isAdmin, setIsAdmin] = useState(false);
//   const token = localStorage.getItem("token");
//   // const isAdmin = localStorage.getItem("isAdmin");
//   // const isLogin = token !== undefined;
//   // console.log(token);
//   // if (token) {
//   //   setIsAdmin(true);
//   // }
//   // console.log(isAdmin,"isAdmin");

//   // const { isAuthenticated, isAdmin } = useSelector(
//   //   (state: RootState) => state.auth
//   // );

//   // return token && isAdmin ? <Outlet /> : <Navigate to="/login" />;
//   // };
//   const admin = localStorage.getItem("isAdmin") === "true";
//   console.log(
//     "isAdmin route",
//     admin,
//     typeof admin,
//     typeof localStorage.getItem("isAdmin")
//   );

//   if (!token) {
//     return <Navigate to="/login" />;
//   } else {
//     <Navigate to="/PeopleProfile" />;
//   }

//   return admin ? <Navigate to="/PeopleProfile" /> : <div>outlet</div>;
// };

// export default AdminRoutes;
