import React from "react";

const Schedule = () => {
  const schedule = {
    A: [
      { time: "10:00 AM", title: "Opening Ceremony", description: "Welcome address and introduction." },
      { time: "11:00 AM", title: "Keynote Speech", description: "Guest speaker session." },
    ],
    B: [
      { time: "10:30 AM", title: "Workshop on React", description: "Hands-on session with React." },
      { time: "12:00 PM", title: "Q&A Session", description: "Interactive question-answer session." },
    ],
    C: [
      { time: "11:00 AM", title: "Networking Event", description: "Meet and greet." },
      { time: "1:00 PM", title: "Closing Remarks", description: "Event summary and closure." },
    ],
  };
  return (
    <div>
      <div className="flex justify-between items-center border-b border-[#DDDBE4]">
        <div className="flex">
          <div className="flex">
            <h1>wed</h1>
            <span>24 Jan</span>
          </div>
          <div className="flex">
            <h1>wed</h1>
            <span>24 Jan</span>
          </div>
        </div>
        <button className="flex items-center px-[5px] w-[346px] h-[65px] justify-between">
          <span>Download</span> <span>|</span>
        </button>
      </div>
      <div>
        
      </div>
    </div>
  );
};

export default Schedule;
