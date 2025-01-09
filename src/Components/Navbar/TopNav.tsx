import {  useEffect, useState } from "react";
import Logo from "../../assets/Icons/CreatorsMelaLogo.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HamburgerMenu from "../../assets/Images/hamburgerMenu.svg";
// import ProfilePicture from "../../assets/Images/ProfilePicture.png";
import DropDown from "../../assets/Icons/DownArrow.svg";
import Uparrow from "../../assets/Icons/UpArrow.svg";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_URL;

const TopNav = ({ isLogIn, setIsLogin }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(false);
  const [hamNavSelected, setHamNavSelected] = useState(false);
  const [profilePicture, setProfilePicture] = useState([]);
  // const [isLogIn, setIsLogIn] = useState(false);
  if (pathname === "/") {
    // localStorage.removeItem("token");
    // localStorage.removeItem("isAdmin");
    localStorage.clear();
  }
  const token = localStorage.getItem("token");
  // const isAdmin = JSON.parse(localStorage.getItem("is_admin"));
  // console.log("isAdmin", typeof isAdmin);

  const handleLogin = () => {
    setIsLogin(true);
  };

  // console.log(token, "token");

  const portalNavData = [
    { id: 1, path: "/Schedule", page: "Schedule" },
    { id: 2, path: "/PerformerPanel", page: "Performers" },
    { id: 3, path: "/SpeakerPanel", page: "Speaker" },
  ];

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const toggleHamburgerMenu = () => {
    setHamNavSelected(!hamNavSelected);
  };

  const toggleProfileDropdown = () => {
    setSelected((prev) => !prev);
  };

  useEffect(() => {
    if (hamNavSelected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [hamNavSelected]);
  // console.log(isLogIn, "Login");

  useEffect(() => {
    if (token) {
      const fetchProfilePicture = async () => {
        try {
          // const token = localStorage.getItem("token");
          const response = await axios.get(`${BASE_URL}/people/profile_pic/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          // console.log("response", response);
          const results = response.data;

          setProfilePicture(results);
        } catch (error) {
          console.error("Error fetching performers:", error);
        }
      };
      fetchProfilePicture();
    }
  }, []);

  // console.log("profilePicture", profilePicture.profile_picture);

  return (
    <>
      {/* Desktop Navigation */}
      <div className="bg-[#251C65] sticky top-0 w-full z-50 hidden lg:block px-[50px] ">
        <div
          className={`flex h-[180px] w-full items-center text-white ${
            !isHomePage && !token ? "justify-between" : "justify-end"
          }`}
        >
          {!isHomePage && !token && (
            <Link to="/">
              <img
                src={Logo}
                alt="Creator's Mela Logo"
                className="navbarImage"
              />
            </Link>
          )}
          <div className="flex p-3 gap-[40px]">
            {!token && (
              <Link
                to="/login"
                onClick={handleLogin}
                className="cursor-pointer font-[500] text-[24px]"
              >
                Login
              </Link>
            )}
            {!token && (
              <Link
                to="/AboutUs"
                className="cursor-pointer font-[500] text-[24px]"
              >
                About
              </Link>
            )}
            {token &&
              portalNavData.map((navItem) => (
                <Link key={navItem.id} to={navItem.path}>
                  <span className="cursor-pointer font-[500] text-[24px]">
                    {navItem.page}
                  </span>
                </Link>
              ))}
            {token && (
              <div className="relative flex px-[20px] gap-[10px]">
                <div className="rounded-full w-[43px] h-[43px]">
                  <img
                    src={profilePicture.profile_picture}
                    alt="Profile"
                    className="w-full h-full rounded-full"
                  />
                </div>
                <button
                  className="cursor-pointer"
                  onClick={toggleProfileDropdown}
                >
                  {selected ? (
                    <img src={Uparrow} alt="Uparrow" />
                  ) : (
                    <img src={DropDown} alt="Downarrow" />
                  )}
                </button>
                {selected && (
                  <div className="absolute right-0 mt-[60px] bg-white text-black rounded-lg shadow-lg py-3 px-5">
                    <Link to="/UserProfile" className="block pb-2">
                      Profile
                    </Link>
                    <Link to="/EditProfile" className="block pb-2">
                      Settings
                    </Link>
                    <button
                      onClick={() => navigate("/")}
                      className="block text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden flex gap-[36px] justify-end pr-[36px] bg-[#251C65]  sticky top-0 h-[55px] items-center z-50">
        <Link to="/applyPage">
          <span className="cursor-pointer font-[500] text-[16px] bg-[#E02C79] rounded-[84px] h-[35px] w-[113px] flex items-center justify-center">
            Apply Now!
          </span>
        </Link>
        {token && (
          <div className="relative flex px-[20px] gap-[10px]">
            <div className="rounded-full w-[43px] h-[43px]">
              <img
                src={profilePicture.profile_picture}
                alt="Profile"
                className="w-full h-full rounded-full"
              />
            </div>
            <button className="cursor-pointer" onClick={toggleProfileDropdown}>
              {selected ? (
                <img src={Uparrow} alt="Uparrow" />
              ) : (
                <img src={DropDown} alt="Downarrow" />
              )}
            </button>
            {selected && (
              <div className="absolute mt-[60px] bg-white text-black rounded-lg shadow-lg py-3 px-5">
                <Link to="/UserProfile" className="block pb-2">
                  Profile
                </Link>
                <Link to="/EditProfile" className="block pb-2">
                  Settings
                </Link>
                <button
                  onClick={() => navigate("/")}
                  className="block text-red-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
        <button onClick={toggleHamburgerMenu}>
          <img src={HamburgerMenu} alt="Open Menu" />
        </button>
      </div>

      {/* Hamburger Menu */}
      <div
        className={`fixed inset-0 bg-gradient-to-b from-[#78C5F129] to-[#E8E8E83B] shadow-[#0D092840] backdrop-blur-2xl transition-all z-[100] max-h-screen ${
          hamNavSelected ? "block" : "hidden"
        }`}
      >
        <div className="bg-[#00000014] w-full h-full shadow-lg p-5">
          <button
            className="text-white text-2xl font-bold"
            onClick={toggleHamburgerMenu}
          >
            X
          </button>
          {token ? (
            <div className="flex flex-col gap-[47px] mt-5 h-[440px] w-full">
              {portalNavData.map((navItem) => (
                <Link key={navItem.id} to={navItem.path} className="border-b">
                  <span className="cursor-pointer font-[700] text-[40px] text-white">
                    {navItem.page}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-[47px] mt-5 h-[440px] w-full">
              {pathname !== "/" ? (
                <Link to="/" className="border-b" onClick={toggleHamburgerMenu}>
                  <span className="cursor-pointer font-[700] text-[40px] text-white">
                    Home Page
                  </span>
                </Link>
              ) : (
                ""
              )}
              <Link to="/login" className="border-b">
                <span className="cursor-pointer font-[700] text-[40px] text-white">
                  Login
                </span>
              </Link>
              <Link
                to="/AboutUs"
                className="border-b"
                onClick={toggleHamburgerMenu}
              >
                <span className="cursor-pointer font-[700] text-[40px] text-white">
                  About Us
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TopNav;
