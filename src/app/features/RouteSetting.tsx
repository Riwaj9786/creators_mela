import AboutUs from "../../Pages/AboutUs/AboutUs";
import HomePage from "../../Pages/HomePage/HomePage";

export const allRoutes = [
  {
    id: 1,
    name: "homepage",
    title: "HomePage",
    path: "/",
    element: <HomePage />,
  },
  {
    id: 2,
    name: "AboutUs",
    title: "About Us",
    path: "/AboutUs",
    element: <AboutUs />,
  },
];
