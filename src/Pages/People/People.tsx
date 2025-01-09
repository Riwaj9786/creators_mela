import { SubmitHandler, useForm } from "react-hook-form";
import People from "../../assets/Icons/people.svg";
import Refresh from "../../assets/Icons/refresh-right-square.svg";
import PeopleTable from "../../Components/CeratorsMelaPeopleTable/PeopleTable";
import { useState } from "react";
import TeamTable from "../../Components/CeratorsMelaPeopleTable/TeamTable";
import SpeakerTable from "../../Components/CeratorsMelaPeopleTable/SpeakerTable";

type Inputs = {
  Search: string;
  Gender: string;
  ApprovalStatus: string;
};

const PeoplePage = () => {
  const [peopleState, setPeopleState] = useState("Guest");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedApproval, setSelectedApproval] = useState("");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    reset();
  };

  return (
    <div className="pt-[18px] ">
      {/* people section */}
      <div className="flex items-center justify-between">
        <div className="flex gap-[16px]">
          {["Guest", "Team", "Speakers"].map((state) => (
            <button
              key={state}
              className={`p-[10px] text-[32px] font-[500] cursor-pointer ${
                peopleState === state
                  ? "border-b border-[#65E8BF] text-[#65E8BF] "
                  : "text-white"
              }`}
              onClick={() => setPeopleState(state)}
            >
              {state}
            </button>
          ))}
        </div>
        <button className="px-[23px] flex items-center justify-between bg-[#65E8BF] shadow-[#6F7EC940] h-[65px] w-[259px] rounded-[15px]">
          <span className="text-[#110D2F] text-[24px] font-[500]">Invite</span>
          <img src={People} alt="People Icon" />
        </button>
      </div>

      {/* search section */}
      <div className="pt-[27px] h-[64px] w-full flex justify-between items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center justify-between w-full"
        >
          <div className="flex gap-[24px] items-end  h-full ">
            {/* Search */}
            <div className="flex flex-col gap-[4px]">
              <span className="text-[#FFFFFFB2] text-[12px] font-[400]">
                Search
              </span>
              <input
                type="text"
                placeholder="Search People"
                {...register("Search", {
                  onChange: (e) => setSearchQuery(e.target.value),
                })}
                value={searchQuery}
                className="w-[331px] rounded-[8px] h-[46px] border border-[#FFFFFF80]"
              />
              {errors.Search && (
                <p className="text-red-500 text-sm">{errors.Search.message}</p>
              )}
            </div>
            {/* Gender */}
            {peopleState === "Guest" ? (
              <div className="flex flex-col gap-[4px]">
                <span className="text-[#FFFFFFB2] text-[12px] font-[400]">
                  Gender
                </span>
                <select
                  {...register("Gender", {
                    onChange: (e) => setSelectedGender(e.target.value),
                  })}
                  defaultValue=""
                  className="w-[154px] rounded-[8px] h-[32px] border border-[#FFFFFF80]"
                >
                  <option value="" disabled>
                    All Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Others</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Not Specified">Not Specified</option>
                </select>
                {errors.Gender && (
                  <p className="text-red-500 text-sm">
                    {errors.Gender.message}
                  </p>
                )}
              </div>
            ) : (
              ""
            )}
            {/* Approval Status */}
            {peopleState === "Guest" ? (
              <div className="flex flex-col gap-[4px]">
                <span className="text-[#FFFFFFB2] text-[12px] font-[400]">
                  Approval Status
                </span>
                <select
                  {...register("ApprovalStatus", {
                    onChange: (e) => setSelectedApproval(e.target.value),
                  })}
                  defaultValue=""
                  className="w-[154px] rounded-[8px] h-[32px] border border-[#FFFFFF80]"
                >
                  <option value="" disabled>
                    All Status
                  </option>
                  <option value="Accepted">Approved</option>
                  <option value="Rejected">Not Approved</option>
                  <option value="Pending">Pending</option>
                </select>
                {errors.ApprovalStatus && (
                  <p className="text-red-500 text-sm">
                    {errors.ApprovalStatus.message}
                  </p>
                )}
              </div>
            ) : (
              ""
            )}
            {peopleState === "Guest" ? (
              <div className="h-full  ">
                <button className="items-center flex justify-center ">
                  <img src={Refresh} alt="" />
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
          <button
            type="button"
            className="text-[#65E8BF] border border-[#65E8BF] rounded-3xl"
          >
            Download
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="mt-10 ">
        {peopleState === "Guest" ? (
          <PeopleTable
            search={searchQuery}
            gender={selectedGender}
            approveStatus={selectedApproval}
          />
        ) : (
          ""
        )}
        {peopleState === "Team" ? <TeamTable search={searchQuery} /> : ""}
        {peopleState === "Speakers" ? (
          <SpeakerTable search={searchQuery} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default PeoplePage;
