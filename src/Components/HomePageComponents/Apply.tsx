import React from "react";

const Apply = () => {
  return (
    <div className="rounded-[20px] bg-gradient-to-b from-[#78C5F129] to-[#E8E8E83B] h-[541px] w-[553px] py-[44px] px-[32px] border-[1px] border-[#FFFFFF4D]">
      <div className="w-3/4 leading-none gap-[12px]">
        <h1 className="text-[#65E8BF] text-[40px] font-[700] ">
          Are you an apiring content creator?
        </h1>
        <h2 className="text-white text-[16px] font-[400]">
          Then, Creators Mela 2024 is for you.
        </h2>
      </div>
      <div className="flex flex-col gap-[26px] mt-[26px]">
        <div className="flex flex-col gap-[8px]">
          <span className="text-white text-[18px] font-[400]">Name</span>
          <input
            type="text"
            placeholder="Enter your Name"
            className="rounded-[8px] h-[62px] pl-[19px]"
          />
        </div>
        <div className="flex flex-col gap-[8px]">
          <span className="text-white text-[18px] font-[400]">Email</span>
          <input
            type="text"
            placeholder="Enter your Email"
            className="rounded-[8px] h-[62px] pl-[19px]"
          />
        </div>
      </div>
      <div className="flex justify-center items-center h-[80px] w-[490px] rounded-[84px] bg-[#E02C79] mt-[32px]">
        <span className="text-white text-[18px] font-[400] ">
          Apply to join
        </span>
      </div>
    </div>
  );
};

export default Apply;
