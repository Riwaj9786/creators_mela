import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import DropDown from "../../Icons/DownArrow.svg";
import Uparrow from "../../Icons/UpArrow.svg";
// import ProfilePicture from "../../Images/ProfilePicture.png";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_URL;

const AdminLayout = ({}) => {
  const [selected, setSelected] = useState(false);
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState([]);

  const toggleProfileDropdown = () => {
    setSelected((prev) => !prev);
  };

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/people/profile_pic/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const results = response.data;

        setProfilePicture(results);
      } catch (error) {
        console.error("Error fetching performers:", error);
      }
    };
    fetchProfilePicture();
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      <div>
        <Sidebar />
      </div>
      <div className=" px-[32px] w-[calc(100vw-120px)] ">
        <div className="w-full flex justify-between h-[85px] items-center ">
          <h1 className="text-white"> Creators Mela/People</h1>
          <div>
            <div className="relative flex px-[20px] gap-[10px]">
              <div className="rounded-full w-[43px] h-[43px]">
                <img
                  src={profilePicture.profile_picture}
                  alt="Profile"
                  className="w-full h-full rounded-full"
                />
              </div>
              <button
                className="cursor-pointer"
                onClick={toggleProfileDropdown}
              >
                {selected ? (
                  <img src={Uparrow} alt="Uparrow" />
                ) : (
                  <img src={DropDown} alt="Downarrow" />
                )}
              </button>
              {selected && (
                <div className="absolute right-0 mt-[60px] bg-white text-black rounded-lg shadow-lg py-3 px-5">
                  <Link to="/PeopleProfile" className="block pb-2">
                    Profile
                  </Link>
                  <Link to="/settings" className="block pb-2">
                    Settings
                  </Link>
                  <button
                    onClick={() => navigate("/")}
                    className="block text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
