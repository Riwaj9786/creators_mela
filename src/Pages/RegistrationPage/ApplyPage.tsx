import { Link } from "react-router-dom";
import Apply from "../../Components/HomePageComponents/Apply";

const ApplyPage = () => {
  return (
    <div className="flex flex-col py-[32px] px-[32px]">
      <Link to="/">
        <button className="text-[16px] font-[500] text-white flex flex-start">
          Back
        </button>
      </Link>
      <div className="flex justify-center items-center ">
        <Apply />
      </div>
    </div>
  );
};

export default ApplyPage;
