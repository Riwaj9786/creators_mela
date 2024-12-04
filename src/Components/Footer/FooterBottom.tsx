import Logo from "../../assets/Icons/CreatorsMelaLogo.svg";
import AppleStore from "../../assets/Icons/AppleStore.png";
import GoogleStore from "../../assets/Icons/GooglePlay.png";
import FB from "../../assets/Icons/FB.svg";
import IG from "../../assets/Icons/IG.svg";
import Twitter from "../../assets/Icons/Twitter.svg";
import YT from "../../assets/Icons/YT.svg";

const navData = [
  { id: 1, title: "About" },
  { id: 2, title: "Schedule" },
  { id: 3, title: "Performers" },
  { id: 4, title: "Speakers" },
  { id: 5, title: "Terms of Service" },
  { id: 6, title: "Help" },
  { id: 7, title: "Contact Us" },
];

const FooterBottom = () => {
  // console.log(navData, "navData");
  return (
    <div className="bg-[#25235E] text-white">
      <div className="p-x-[22.4px] p-y-[64px]">
        <div className="flex ">
          <div>
            <div>
              <img src={Logo} alt="" />
            </div>
            <div>
              {navData.map((navItems) => (
                <span key={navItems.id} className="cursor-pointer"> {navItems.title}</span>
              ))}
            </div>
          </div>
          <div>
            <h1>Get the app</h1>
            <img src={AppleStore} alt="" />
            <img src={GoogleStore} alt="" />
          </div>
        </div>
        <div className="flex justify-around border-t border-[1px]">
          <span>© 2024 Made by Techcolab. </span>
          <div className="flex">
            <img src={FB} alt="" />
            <img src={IG} alt="" />
            <img src={Twitter} alt="" />
            <img src={YT} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
