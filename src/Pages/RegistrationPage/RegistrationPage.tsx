import BackgroundImage from "../../assets/Images/RegistrationPageBackground.jpeg";

import LeftArrow from "../../assets/Icons/LeftArrow.svg";
import RegistrationForm from "../../Components/RegistrationForm/RegistrationForm";
import { Link } from "react-router-dom";

const RegistrationPage = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
      className="mx-[250px] rounded-[42px] hidden lg:block"
    >
      <div className="bg-gradient-to-r from-[#78C5F129] to-[#00000014] via-[#E8E8E83B]">
        <Link to="/" className="pt-[40px] px-[40px] flex">
          <img src={LeftArrow} alt="" />
          <span className="font-[500] text-[16px] text-white">Back</span>
        </Link>
        <div className="pl-[50px]">
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
