import CreatorsMelaLogo from "../../Icons/CreatorsMelaLogo.svg";
import Calender from "../../Icons/calendar-2.svg";
import Graph from "../../Icons/graph.svg";
import People from "../../Icons/people.svg";
import MagicStar from "../../Icons/magic-star.svg";
import Setting from "../../Icons/setting-4.svg";
import { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [selected, setSelected] = useState(null);

  const handleSelection = (index) => {
    setSelected(index);
  };

  return (
    <div className="bg-[#25235E] w-[100px] h-full pt-[27px] flex flex-col items-center">
      <div className="h-[75px] w-[99px]">
        <Link to="/PeopleProfile">
          <img src={CreatorsMelaLogo} alt="" className="h-full w-full" />
        </Link>
      </div>
      <div className="flex flex-col h-full justify-between pb-[29px]">
        <div className="flex flex-col pt-[47px] justify-center items-center gap-5">
          <Link to="/EventDetails">
            <div
              className={`${
                selected === 0 ? "bg-[#2D8A6D]" : "bg-[#4E4C8C]"
              } cursor-pointer w-[60px] h-[60px] rounded-[20px] flex justify-center items-center`}
              onClick={() => handleSelection(0)}
            >
              <img src={Calender} alt="" className="h-[36px] w-[36px]" />
            </div>
          </Link>
          <Link to="/Analytics">
            <div
              className={`${
                selected === 1 ? "bg-[#2D8A6D]" : "bg-[#4E4C8C]"
              } cursor-pointer w-[60px] h-[60px] rounded-[20px] flex justify-center items-center`}
              onClick={() => handleSelection(1)}
            >
              <img src={Graph} alt="" className="h-[36px] w-[36px]" />
            </div>
          </Link>

          <Link to="/people">
            <div
              className={`${
                selected === 2 ? "bg-[#2D8A6D]" : "bg-[#4E4C8C]"
              } cursor-pointer w-[60px] h-[60px] rounded-[20px] flex justify-center items-center`}
              onClick={() => handleSelection(2)}
            >
              <img src={People} alt="" className="h-[36px] w-[36px]" />
            </div>
          </Link>

          <Link to="/BrandMagic">
            <div
              className={`${
                selected === 3 ? "bg-[#2D8A6D]" : "bg-[#4E4C8C]"
              } cursor-pointer w-[60px] h-[60px] rounded-[20px] flex justify-center items-center`}
              onClick={() => handleSelection(3)}
            >
              <img src={MagicStar} alt="" className="h-[36px] w-[36px]" />
            </div>
          </Link>
        </div>
        <div
          className={`${
            selected === 4 ? "bg-[#2D8A6D]" : "bg-[#4E4C8C]"
          } cursor-pointer w-[60px] h-[60px] rounded-[20px] flex justify-center items-center`}
          onClick={() => handleSelection(4)}
        >
          <img src={Setting} alt="" className="h-[36px] w-[36px]" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
