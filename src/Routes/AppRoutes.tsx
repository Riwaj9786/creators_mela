import React from "react";
import PageError from "../Pages/ErrorPage/PageError";
import { Routes, Route } from "react-router-dom";
import HomePage from "../Pages/HomePage/HomePage";
import AboutUs from "../Pages/AboutUs/AboutUs";
import TermsOfService from "../Pages/TermsOfService/termsOfService";
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegistrationPage from "../Pages/RegistrationPage/RegistrationPage";
import SpeakerPanel from "../Pages/SpeakerPanel/SpeakerPanel";
import PerformersPanel from "../Pages/PerformersPanel/PerformersPanel";
import Help from "../Pages/FAQs/Help";
import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy";
import ApplyPage from "../Pages/RegistrationPage/ApplyPage";
import OtpPage from "../Pages/OTPPgae/OtpPage";
import ProtectedRoutes from "./ProtectedRoute";
import ContactUs from "../Pages/ContactUs/ContactUs";
import WebsiteLayout from "../assets/ComponentsData/WebsiteLayout";
import AdminLayout from "../assets/ComponentsData/AdminLayout";
import PeoplePage from "../Pages/People/People";
import UserProfile from "../Pages/UserPage";
import PeopleProfile from "../Pages/People/PeopleProfile";
import SchedulePage from "../Pages/Schedule/schedulePage";
import RegistrationSuccess from "../Pages/RegistrationPage/RegisterSuccess";
import SocialMediaRegistrationPage from "../Pages/RegistrationPage/SocialMediaRegistrationPage";
import AdminDashboard from "../Pages/AdminDashboard/AdminDashboard";
import EventDetails from "../Pages/EventManage/EventDetails";
import CreateSession from "../Pages/CreateSessionPage/CreateSession";
import SessionPreview from "../Pages/CreateSessionPage/SessionPreview";
import EditProfile from "../Pages/EditProfile/EditProfile";
import Analytics from "../Pages/Analytics/Analytics";
import BrandMagic from "../Pages/BrandMagic/BrandMagic";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<WebsiteLayout />}>
        <Route path="/" element={<HomePage />}></Route>
      </Route>
      <Route element={<WebsiteLayout />}>
        <Route path="/help" element={<Help />}></Route>
      </Route>
      <Route element={<WebsiteLayout />}>
        <Route path="/AboutUs" element={<AboutUs />}></Route>
      </Route>
      <Route element={<WebsiteLayout />}>
        <Route path="/termsOfService" element={<TermsOfService />}></Route>
      </Route>
      <Route element={<WebsiteLayout />}>
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />}></Route>
      </Route>
      <Route element={<WebsiteLayout />}>
        <Route path="/contactUs" element={<ContactUs />}></Route>
      </Route>
      <Route element={<WebsiteLayout />}>
        <Route path="/applyPage" element={<ApplyPage />}></Route>
      </Route>

      {/* userlayout routes*/}
      <Route element={<ProtectedRoutes allowedRoles={["user"]} />}>
        <Route element={<WebsiteLayout />}>
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route path="/SpeakerPanel" element={<SpeakerPanel />} />
          <Route path="/PerformerPanel" element={<PerformersPanel />} />
          <Route path="/Schedule" element={<SchedulePage />} />
          <Route path="/RegistrationPage" element={<RegistrationPage />} />
          <Route path="/RegisterSuccess" element={<RegistrationSuccess />} />
          <Route path="/EditProfile" element={<EditProfile />} />
          <Route
            path="/SocialMediaRegistrationPage"
            element={
              <div className="flex justify-center">
                <SocialMediaRegistrationPage />
              </div>
            }
          />
        </Route>
      </Route>

      {/* admin routes */}
      <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/People" element={<PeoplePage />} />
          <Route path="/PeopleProfile" element={<PeopleProfile />} />
          <Route path="/EventDetails" element={<EventDetails />} />
          <Route path="/CreateSession" element={<CreateSession />} />
          <Route path="/SessionPreview/:slug" element={<SessionPreview />} />
          <Route path="/Analytics" element={<Analytics />} />
          <Route path="/BrandMagic" element={<BrandMagic />} />
        </Route>
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/OtpPage" element={<OtpPage />} />
      <Route path="*" element={<PageError />} />
    </Routes>
  );
};

export default AppRoutes;
