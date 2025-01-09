import FooterBottom from "../../Components/Footer/FooterBottom";
import BGImage from "../../assets/Images/BackgroundImage.jpg";
import LeftArrow from "../../assets/Icons/LeftArrow.svg";
import { Link } from "react-router-dom";
import SuccessImage from "../../assets/Images/SuccessImage.png";

const RegistrationSuccess = () => {
  return (
    <div
      className=""
      style={{
        backgroundImage: `url(${BGImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <div className="mx-[250px] rounded-[42px] pt-[54px] pb-[154px]">
        <div className="bg-gradient-to-r from-[#78C5F129] to-[#00000014] via-[#E8E8E83B] rounded-[24px] border-[2px] border-[#FFFFFF33] pb-[223px]">
          <Link to="/" className="pt-[40px] px-[40px] flex">
            <img src={LeftArrow} alt="" />
            <span className="font-[500] text-[16px] text-white">Back</span>
          </Link>
          <div className="flex flex-col justify-center items-center gap-y-[61px] pt-[98px]">
            <img src={SuccessImage} alt="" />
            <div className="flex flex-col justify-center items-center h-[126px] w-[788px]">
              <h1 className="text-white text-[48px] font-[400]">
                Thank you for applying!
              </h1>
              <p className="text-white text-[20px] font-[500]">
                Thank you for submitting your application for the Creator's Mela
                2024. Our team will review your application and respond with
                your status within the next 48hrs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
