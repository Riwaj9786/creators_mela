import { Link, useNavigate } from "react-router-dom";
import Login from "../../Components/Login/Login";
import Logo from "../../assets/Icons/CreatorsMelaLogo.svg";
import InfoCIrcle from "../../assets/Icons/InfoCircle.svg";
import { useEffect } from "react";

const LoginPage = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  // console.log("loaction", location);
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("is_admin");

  useEffect(() => {
    if (token) {
      if (isAdmin) {
        navigate("/PeopleProfile");
      } else {
        navigate("/UserProfile");
      }
    }
  }, []);

  return (
    <>
      <div>
        <div className="flex">
          <Link to="/">
            <img src={Logo} alt="" />
          </Link>
        </div>
        <div className=" flex flex-col justify-center items-center  min-h-[calc(100vh-180px)]">
          <Login />

          <div className="flex md:w-[477px] h-[57px] text-white items-start gap-[8px] text-[16px] font-[400] pt-[100px]">
            <img src={InfoCIrcle} alt="" />
            <p className="leading-none md:leading-1">
              To login, please use the official email and the password you had
              generated previously. For any assistance related to the portal,
              contact technical@creatorsmela.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
