// import React from "react";
import TopNav from "../../../Components/Navbar/TopNav";
import FooterBottom from "../../../Components/Footer/FooterBottom";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const WebsiteLayout = () => {
  const [isLogIn, setIsLogIn] = useState(false);

  return (
    <div>
      <TopNav isLogIn={isLogIn} setIsLogin={setIsLogIn} />
      <div><Outlet/></div>
      <FooterBottom />
    </div>
  );
};

export default WebsiteLayout;
