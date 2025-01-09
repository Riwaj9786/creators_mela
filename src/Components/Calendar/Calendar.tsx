import  { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "./CalendarStyle.css";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_URL;

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [sessions, setSessions] = useState({ count: 0, data: [] });
  const [loading, setLoading] = useState(true);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `${BASE_URL}/events/session/ongoing/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handlePrev = () => {
    setCurrentSessionIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : sessions.data.length - 1
    );
  };

  const handleNext = () => {
    setCurrentSessionIndex((prevIndex) =>
      prevIndex < sessions.data.length - 1 ? prevIndex + 1 : 0
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const formatMonthYear = (locale, date) => {
    const options = { year: "numeric", month: "long" };
    return `${date.toLocaleDateString(locale, options)}`;
  };

  const currentSession =
    sessions.data.length > 0 ? sessions.data[currentSessionIndex] : null;

  return (
    <div className="w-[377px] flex flex-col gap-y-[32px] bg-[#FFFFFF1A] rounded-[16px] border border-[#FFFFFF33] shadow-[#0D092840] p-[21px]">
      <div className="flex justify-between items-center">
        <span className="text-white text-[24px] font-[500]">Calendar</span>
        <span className="text-[#65E8BF] text-[12px] font-[400]">
          Edit Event
        </span>
      </div>
      <div className="bg-gradient-to-b from-[#78C5F129] via-[#E8E8E83B] to-[#00000014] border border-[#FFFFFF33] shadow-[#0D092840] rounded-[20px]">
        <Calendar
          onChange={setDate}
          value={date}
          className="text-white react-calendar"
          next2Label={null}
          prev2Label={null}
          formatMonthYear={formatMonthYear}
          nextLabel={">"}
          prevLabel={"<"}
        />
        <p className="text-center mt-4 text-sm text-white">
          Selected date:{" "}
          <span className="font-semibold text-blue-600">
            {date.toDateString()}
          </span>
        </p>
      </div>
      {/* Ongoing Sessions */}
      <div className="w-full bg-gradient-to-b from-[#78C5F129] via-[#E8E8E83B] to-[#00000014] border border-[#FFFFFF33] shadow-[#0D092840] rounded-[20px] p-4">
        <div className="flex justify-between items-center">
          <span className="text-white text-[24px] font-[500]">
            Ongoing Session
          </span>
          <span className="text-black bg-[#65E8BF] text-[20px] font-[500] rounded-full h-[37px] w-[37px] flex items-center justify-center">
            {sessions.count}
          </span>
        </div>
        {currentSession ? (
          <div className="mt-4">
            <h1 className="text-white font-semibold">
              {currentSession.session_name}
            </h1>
            {currentSession.speakers.length > 0 ? (
              <p className="text-sm text-gray-300">
                {currentSession.speakers.map((speaker, idx) => (
                  <span
                    key={idx}
                    className="text-[#BDDFD2] text-[10px] font-[400]"
                  >
                    {speaker.name}
                    {idx < currentSession.speakers.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            ) : (
              <p className="text-sm text-gray-400">No speakers</p>
            )}
            <p className="text-sm text-gray-300">
              Time: {currentSession.start_time} - {currentSession.end_time}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-4">No ongoing sessions</p>
        )}
        <div className="flex justify-between mt-4">
          <span
            onClick={handlePrev}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            {"< prev"}
          </span>
          <span
            onClick={handleNext}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            {"next >"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;
