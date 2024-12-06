import React from "react";
import Logo from "../../assets/Icons/CreatorsMelaLogo.svg";
import { Link } from "react-router-dom";

const TopNav = () => {
  const navData = [
    { id: 1, path: "/AboutUs", page: "About" },
    { id: 2, path: "/Schedule", page: "Schedule" },
    { id: 3, path: "/AboutUs", page: "Performers" },
    { id: 4, path: "/Speakers", page: "Speakers" },
  ];

  return (
    <div className="bg-[#251C65]">
      <div className="flex h-[180px] w-full items-center text-white justify-between">
        <div className="">
          <Link to="/">
            <img src={Logo} alt="Creator's Mela Logo" className="navbarImage" />
          </Link>
        </div>
        <div className="flex p-3 gap-[40px]">
          {navData.map((navItem, index) => (
            <Link to={navItem.path}>
              <span
                key={index}
                className="cursor-pointer font-[500] text-[24px]"
              >
                {navItem.page}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
