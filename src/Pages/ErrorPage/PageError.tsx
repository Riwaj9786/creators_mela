import React from "react";
import { useNavigate } from "react-router-dom";

const PageError = () => {
  const navigate = useNavigate();
  return (
    <div className="text-white text-[48px] flex flex-col justify-center items-center">
      <h1>PageError</h1>
      <button onClick={() => navigate("/")}>GoTo HomePage</button>
    </div>
  );
};

export default PageError;
