import React from "react";
import Logo from "../../assets/Icons/CreatorsMelaLogo.svg";

const TopNav = () => {
  const navData = ["About", "Schedule", "Performers", "Speakers"];

  return (
    <div className="bg-[#251C65]">
      <div className="flex h-[180px] w-full items-center text-white justify-between">
        <div className="">
          <img
            src={Logo}
            alt="Creator's Mela Logo"
            className="navbarImage"
          />
        </div>
        <div className="flex p-3 gap-[40px]">
          {navData.map((navItem, index) => (
            <span key={index} className="cursor-pointer font-[500] text-[24px]">{navItem}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
