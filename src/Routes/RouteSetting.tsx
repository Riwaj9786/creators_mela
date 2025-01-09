import RegistrationSuccess from "../Pages/RegistrationPage/RegisterSuccess";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Help from "../Pages/FAQs/Help";
import HomePage from "../Pages/HomePage/HomePage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import OtpPage from "../Pages/OTPPgae/OtpPage";
import PerformersPanel from "../Pages/PerformersPanel/PerformersPanel";
import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy";
import ApplyPage from "../Pages/RegistrationPage/ApplyPage";
import RegistrationPage from "../Pages/RegistrationPage/RegistrationPage";
import SpeakerPanel from "../Pages/SpeakerPanel/SpeakerPanel";
import TermsOfService from "../Pages/TermsOfService/termsOfService";
import People from "../Pages/People/People";

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
  {
    id: 3,
    name: "RegistrationPage",
    title: "Registration Page",
    path: "/RegistrationPage",
    element: <RegistrationPage />,
  },
  {
    id: 4,
    name: "RegistrationSuccess",
    title: "Registration Success",
    path: "/RegisterSuccess",
    element: <RegistrationSuccess />,
  },
  {
    id: 5,
    name: "SpeakerPanel",
    title: "Speaker Panel",
    path: "/SpeakerPanel",
    element: <SpeakerPanel />,
  },
  {
    id: 6,
    name: "PerformerPanel",
    title: "Performer Panel",
    path: "/PerformerPanel",
    element: <PerformersPanel />,
  },
  {
    id: 7,
    name: "Help",
    title: "Help",
    path: "/help",
    element: <Help />,
  },
  {
    id: 8,
    name: "Terms of Service",
    title: "TermsOfService",
    path: "/termsOfService",
    element: <TermsOfService />,
  },
  {
    id: 9,
    name: "Privacy Policy",
    title: "Privacy Policy",
    path: "/privacyPolicy",
    element: <PrivacyPolicy />,
  },
  {
    id: 10,
    name: "Apply Page",
    title: "ApplyPage",
    path: "/applyPage",
    element: <ApplyPage />,
  },
  {
    id: 11,
    name: "Login Page",
    title: "Login",
    path: "/login",
    element: <LoginPage />,
  },
  {
    id: 12,
    name: "OTP Page",
    title: "LoginPage",
    path: "/OtpPage",
    element: <OtpPage />,
  },
  {
    id: 13,
    name: "Profile",
    title: "Profile",
    path: "/profile",
    element: <People />,
  },
];
