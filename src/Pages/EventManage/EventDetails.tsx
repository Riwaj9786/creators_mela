import { Link } from "react-router-dom";
import CalendarComponent from "../../Components/Calendar/Calendar";

const EventDetails = () => {
  return (
    <div className="flex gap-[37px] w-full mt-[16.5px]">
      <div className="">
        <CalendarComponent />
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center  ">
          <div className="flex gap-x-[28px] h-[33px] items-center">
            <span className="text-[#4BE4B4] text-[20px] font-[700]">
              2024/03/10
            </span>
            <span className="text-[#B1AEC2] text-[16px] font-[400]">|</span>
            <span className="text-[#B1AEC2] text-[16px] font-[400]">
              42 Sessions
            </span>
            <span className="text-[#B1AEC2] text-[16px] font-[400]">|</span>
            <span className="text-[#B1AEC2] text-[16px] font-[400]">
              2 Onging
            </span>
            <span className="text-[#B1AEC2] text-[16px] font-[400]">|</span>
            <span className="text-[#B1AEC2] text-[16px] font-[400]">
              240K+ Participants
            </span>
          </div>
          <div className="flex items-center h-full">
            <Link to="/CreateSession">
              <button className="w-[138px] h-[33px] rounded-[15px] bg-[#65E8BF] text-[#110D2F] text-[14px] font-[500]">
                + Add Session
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
