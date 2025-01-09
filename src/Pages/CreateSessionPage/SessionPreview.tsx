import { useEffect, useState } from "react";
import BGimage from "../../assets/Images/FrameImg.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DiVim } from "react-icons/di";

const BASE_URL = import.meta.env.VITE_APP_URL;

const SessionPreview = () => {
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState([]);

  const { slug } = useParams();
  // console.log(slug);

  useEffect(() => {
    const fetchSessionPreview = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/events/session/update/${slug}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const results = response.data.data;

        // console.log(sessionData, "response.data");

        setSessionData(results);
      } catch (error) {
        console.error("Error fetching performers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionPreview();
  }, []);

  console.log(`${sessionData.banner}`, "banner");

  if (loading) {
    return <div>Loading...</div>;
  }

  // console.log(sessionData.total_seats>0, "totalseats");

  return (
    <>
      {sessionData && (
        <div className="bg-[#FFFFFF1A] backdrop-blur-[48px] rounded-[16px] border border-[#FFFFFF33] shadow-[#0D092840]">
          <div className="px-[23px] py-[19px] gap-[28px] flex flex-col h-full bg-[#0D092840]">
            <div
              className="h-[237px] w-full rounded-[8px]"
              style={{
                backgroundImage: sessionData.banner
                  ? `url(${sessionData.banner} )`
                  : `url(${BGimage} )`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <div className="h-full w-full flex items-end">
                <div className="flex justify-between w-full px-[28px] ">
                  <div className="flex gap-[24px] font-[500] text-[#FFFFFF] items-center">
                    <h1 className="text-[32px]">{sessionData.session_name}</h1>
                    <h2 className="text-[16px]">{sessionData.date}</h2>
                    <h2 className="text-[16px]">{`${sessionData.start_time
                      .split(":")
                      .slice(0, 2)
                      .join(":")} - ${sessionData.end_time
                      .split(":")
                      .slice(0, 2)
                      .join(":")}`}</h2>
                    <h2 className="text-[16px]">
                      {sessionData.hall.hall_name}
                    </h2>
                    <div className="flex items-center justify-center">
                      <button className="bg-[#65E8BF] rounded-[15px] w-[138px] h-[33px] text-[#110D2F] text-[14px]">
                        Edit Session
                      </button>
                    </div>
                  </div>
                  <div className="flex text-[#FFFFFF] font-[500] text-[16px] gap-[12px] pb-[18px] items-center justify-center">
                    <span>
                      {sessionData.total_seats ? sessionData.total_seats : "0"}{" "}
                      seats
                    </span>
                    <div className="flex items-center justify-center">
                      <span className="rounded-full bg-[#65E8BF] h-[4px] w-[4px] border self-center"></span>
                    </div>
                    <span>20 General</span>
                    <div className="flex items-center justify-center">
                      <span className="rounded-full bg-[#65E8BF] h-[4px] w-[4px] border self-center"></span>
                    </div>
                    <span>20 Reserved</span>
                    <div className="flex items-center justify-center">
                      <span className="rounded-full bg-[#65E8BF] h-[4px] w-[4px] border self-center"></span>
                    </div>
                    <span>20Guest Registered</span>
                    <div className="flex items-center justify-center">
                      <span className="rounded-full bg-[#65E8BF] h-[4px] w-[4px] border self-center"></span>
                    </div>
                    <span>20 Guest Attended</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-[33px]">
              <div className="flex flex-col ">
                <p className="leading-none text-white font-[500] text-[20px] ">
                  {sessionData.description}
                </p>
                {/* speker list */}
                <div className="pt-[8px]">
                  {sessionData.speakers && (
                    <div>
                      <span className="text-[#4BE4B4] font-[500] text-[24px]">
                        Session Speakers List
                      </span>
                      <div className="flex gap-x-[8px]">
                        {sessionData.speakers.map((items, index) => (
                          <div
                            key={index}
                            className="w-[133px] h-[52px] rounded-[20px] flex justify-center items-center bg-gradient-b from-[#78C5F129] to-[#E8E8E83B]  backdrop-blur-[48px] shadow-[#0D092840]  border border-[#FFFFFF33]"
                          >
                            <div className=" flex justify-between gap-[8px] px-[8px] items-center  bg-[#00000014]  w-full h-full">
                              <img
                                src={
                                  items.profile_picture
                                    ? items.profile_picture
                                    : ""
                                }
                                alt=""
                                className="w-[41.67px] h-[41.67px] rounded-full  bg-white"
                              />
                              <div className=" w-full flex flex-col">
                                <h1 className="text-[#65E8BF] font-[400] text-[12px]  leading-none">
                                  {items.name}
                                </h1>
                                <span className="text-[#B1AEC2] font-[400] text-[10px]">
                                  Speaker
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* performer list */}
                <div className="pt-[8px]">
                  {sessionData.performers && (
                    <div>
                      <span className="text-[#4BE4B4] font-[500] text-[24px]">
                        Session Performer List
                      </span>
                      <div className="flex gap-x-[8px]">
                        {sessionData.performers.map((items, index) => (
                          <div
                            key={index}
                            className="w-[133px] h-[52px] rounded-[20px] flex justify-center items-center bg-gradient-b from-[#78C5F129] to-[#E8E8E83B]  backdrop-blur-[48px] shadow-[#0D092840]  border border-[#FFFFFF33]"
                          >
                            <div className=" flex justify-between gap-[8px] px-[8px] items-center  bg-[#00000014]  w-full h-full">
                              <img
                                src={
                                  items.profile_picture
                                    ? items.profile_picture
                                    : ""
                                }
                                alt=""
                                className="w-[41.67px] h-[41.67px] rounded-full  bg-white"
                              />
                              <div className=" w-full flex flex-col">
                                <h1 className="text-[#65E8BF] font-[400] text-[12px]  leading-none">
                                  {items.name}
                                </h1>
                                <span className="text-[#B1AEC2] font-[400] text-[10px]">
                                  Speaker
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="">

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionPreview;
