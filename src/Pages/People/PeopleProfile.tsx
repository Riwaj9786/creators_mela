import { useEffect, useState } from "react";
import GuestSmallIcon from "../../assets/Icons/GuestSmallIcon.svg";
import { CgProfile } from "react-icons/cg";
import axios from "axios";


const BASE_URL = import.meta.env.VITE_APP_URL;

const PeopleProfile = () => {
  const [profileDetail, setProfileDetail] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/people/about/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const results = response.data;

        setProfileDetail(results);
      } catch (error) {
        console.error("Error fetching performers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);
  // console.log("profileDetail", profileDetail);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col gap-[30px]">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-gradient-to-br from-[#FF1C8B] via-[#F05A2A] to-[#65E3C3] h-[107px] w-[107px] flex items-center justify-center">
          {profileDetail.profile_picture ? (
            <img
              src={profileDetail.profile_picture}
              alt={profileDetail.user.name}
               className="w-full h-full rounded-full"
            />
          ) : (
            <CgProfile size={107} enableBackground={"#65E8BF"} />
          )}
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[white]">
            {profileDetail.user.name
              ? profileDetail.user.name
              : "Admin Profile"}
          </h1>
          <button
            className="flex items-center space-x-2 text-[#65E8BF] rounded-[24px] border border-[#FFFFFF33] px-3 py-1"
            aria-label="Guest Profile"
          >
            <img src={GuestSmallIcon} alt="Guest Icon" className="h-4 w-4" />
            <span>
              {profileDetail.user.user_type.name
                ? profileDetail.user.user_type.name
                : "User"}
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-[485px] flex flex-col gap-[15px]">
        {/*About Me */}
        <div>
          <h1 className="text-[#26C3B2] text-[40px] font-[700]">About Me</h1>
          <p className="leading-none text-[#DAD9E3] text-[16px] font-[400]">
            {/* Enjoy your favorite dishe and a lovely your friends and family and
            have a great time. Food from local food trucks will be available for
            purchase. Enjoy your favorite dishe and a lovely your friends and
            family and have a great time. Food from local food trucks will be
            available for purchase. Enjoy your favorite dishe and a lovely your
            friends and family and have a great time. Food from local food
            trucks will be available for purchase. */}
            {profileDetail.bio}
          </p>
        </div>

        {/* Gender*/}
        <div>
          <h1 className="text-[#26C3B2] text-[24px] font-[500] leading-none">
            Gender
          </h1>
          <span className="leading-none text-[#DAD9E3] text-[16px] font-[400]">
            {profileDetail.gender ? profileDetail.gender : "N/A"}
          </span>
        </div>

        {/* Age*/}
        <div>
          <h1 className="text-[#26C3B2] text-[24px] font-[500] leading-none">
            Date Of Birth
          </h1>
          <span className="leading-none text-[#DAD9E3] text-[16px] font-[400]">
            {profileDetail.date_of_birth ? profileDetail.date_of_birth : "N/A"}
          </span>
        </div>

        {/* Address*/}
        <div>
          <h1 className="text-[#26C3B2] text-[24px] font-[500] leading-none">
            Address
          </h1>
          <span className="leading-none text-[#DAD9E3] text-[16px] font-[400]">
            {profileDetail.municipality &&
            profileDetail.district &&
            profileDetail.province
              ? `${profileDetail.municipality}, ${profileDetail.district}, ${profileDetail.province}`
              : "N/A"}
          </span>
        </div>

        {/* Interst*/}
        <div>
          <h1 className="text-[#26C3B2] text-[24px] font-[500] leading-none">
            Interst
          </h1>
          <span className="leading-none text-[#DAD9E3] text-[16px] font-[400]">
            {profileDetail.interest ? profileDetail.interest : "N/A"}
          </span>
        </div>

        {/* Socials*/}
        <div>
          <h1 className="text-[#26C3B2] text-[24px] font-[500] leading-none">
            Social
          </h1>
          <span className="leading-none text-[#DAD9E3] text-[16px] font-[400] flex flex-col gap-y-[5px]">
            {profileDetail.social_media &&
              profileDetail.social_media.map((item, index) => (
                <a key={index} href={item.url} className="">
                  {item.platform}
                </a>
              ))}
          </span>
        </div>

        {/* Where did you jear about us?*/}
        <div>
          <h1 className="text-[#26C3B2] text-[24px] font-[500] leading-none">
            Where did you hear about us?
          </h1>
          <span className="leading-none text-[#DAD9E3] text-[16px] font-[400]">
            {profileDetail.heard_from ? profileDetail.heard_from : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PeopleProfile;
