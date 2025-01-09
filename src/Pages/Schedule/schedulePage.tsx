import React from "react";
import Schedule from "../../Components/Schedule/Schedule";

const SchedulePage = () => {
  return (
    <div>
      <div>
        <h1>Schedule</h1>
        <p>
          Advance registration through the app is required for sessions in
          Tactic and Baithak Halls. You may only register for one session per
          time slot.
        </p>
        <Schedule />
      </div>
    </div>
  );
};

export default SchedulePage;
