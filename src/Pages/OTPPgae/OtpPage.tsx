
import FooterBottom from "../../Components/Footer/FooterBottom";
import InfoCIrcle from "../../assets/Icons/InfoCircle.svg";
import Otp from "../../Components/OTP/Otp";

const OtpPage = () => {
  return (
    <div>
      <div className="container flex flex-col gap-[181px] justify-center items-center">
        <Otp />
        <div className="flex w-[477px] h-[57px] text-white items-start gap-[8px] text-[16px] font-[400]">
          <img src={InfoCIrcle} alt="" />
          <p className="">
            To login, please use the official email and the password you had
            generated previously. For any assistance related to the portal,
            contact technical@creatorsmela.com
          </p>
        </div>
      </div>
      <FooterBottom />
    </div>
  );
};

export default OtpPage;
