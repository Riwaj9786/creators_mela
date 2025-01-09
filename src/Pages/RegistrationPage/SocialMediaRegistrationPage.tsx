import BackgroundImage from "../../assets/Images/SocialMediaRegistrationBackgroundImage.png";
import BlurGreen from "../../assets/Images/BlurGreen.svg";
import BlurOrange from "../../assets/Images/BlurOrange.svg";
import InfoCircle from "../../assets/Icons/InfoCircle.svg";

import LeftArrow from "../../assets/Icons/LeftArrow.svg";
import { Link } from "react-router-dom";
import SocialMediaForm from "../../Components/SocialMediaForm/SocialMediaForm";

const SocialMediaRegistrationPage = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        height: "859px",
        width: "1228px",
      }}
      className="rounded-[42px] hidden lg:block relative border-[2px] border-[#FFFFFF33]  "
    >
      <div className="absolute">
        <img
          src={BlurGreen}
          alt=""
          className=" top-[329.4px] left-[980.2px] h-[890px] w-[736.6px] rounded-[42px]"
        />
      </div>
      <div className="absolute">
        <img src={BlurOrange} alt="" className="rounded-[42px]" />
      </div>
      <div className=" h-full w-full rounded-[42px] bg-gradient-to-r from-[#78C5F129] to-[#E8E8E83B] via-[#00000014] shadow-[#0D092840] opacity-[98%]">
        <div className="pl-[50px]">
          <div className="">
            <Link to="/RegistrationPage" className="pt-[40px] flex">
              <img src={LeftArrow} alt="" />
              <span className="font-[500] text-[16px] text-white">Back</span>
            </Link>
            <div className=" ">
              <SocialMediaForm />
            </div>
            <div className="flex items-center">
              <img src={InfoCircle} alt="" />
              <span className=" text-[#FFFFFF] text-[12px] font-[400]">
                Read about
              </span>
              <span className=" text-[#65E8BF] text-[12px] font-[400]">
                the Creator's Mela Data Policy
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaRegistrationPage;
