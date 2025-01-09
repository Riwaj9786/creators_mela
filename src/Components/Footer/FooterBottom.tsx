import Logo from "../../assets/Icons/CreatorsMelaLogo.svg";
import AppleStore from "../../assets/Icons/AppleStore.png";
import GoogleStore from "../../assets/Icons/GooglePlay.png";
import FB from "../../assets/Icons/FB.svg";
import IG from "../../assets/Icons/IG.svg";
import Twitter from "../../assets/Icons/Twitter.svg";
import YT from "../../assets/Icons/YT.svg";
import { Link } from "react-router-dom";

const navData = [
  { id: 1, title: "About", path: "/AboutUs" },
  { id: 2, title: "Schedule", path: "/Schedule" },
  { id: 3, title: "Performers", path: "/PerformerPanel" },
  { id: 4, title: "Speakers", path: "/SpeakerPanel" },
  { id: 5, title: "Terms of Service", path: "/termsOfService" },
  { id: 6, title: "Help", path: "/help" },
  { id: 7, title: "Contact Us", path: "/contactUs" },
  { id: 8, title: "Privacy Policy", path: "/privacyPolicy" },
];

const FooterBottom = () => {
  // console.log(navData, "navData");
  return (
    <div className="bg-[#25235E] text-white flex justify-center ">
      <div className="p-x-[22.4px] p-y-[64px] flex flex-col justify-center  max-w-[1280px]  pt-[43px] container">
        <div className="flex justify-between items-center  ">
          <div>
            <Link to="/">
              <img src={Logo} alt="" />
            </Link>
          </div>
          <div className="flex flex-col gap-[16px]">
            <h1>Get the app</h1>
            <img src={AppleStore} alt="" className="cursor-pointer" />
            <img src={GoogleStore} alt="" className="cursor-pointer" />
          </div>
        </div>
        <div className=" flex items-center gap-[32px] pb-[64px] pt-[32px] flex-wrap ">
          {navData.map((navItems) => (
            <span
              key={navItems.id}
              className="cursor-pointer hover:text-blue-400 hover:translate-y-1"
            >
              <Link to={navItems.path}>{navItems.title}</Link>
            </span>
          ))}
        </div>
        <div className="flex justify-between border-t py-[32px]  flex-wrap">
          <span>© 2024 Made by Techcolab. </span>
          <div className="flex gap-[24px]">
            <img src={FB} alt="" className="cursor-pointer" />
            <img src={IG} alt="" className="cursor-pointer" />
            <img src={Twitter} alt="" className="cursor-pointer" />
            <img src={YT} alt="" className="cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
