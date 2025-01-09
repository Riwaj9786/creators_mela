import tick from "../../assets/Icons/Tick.svg";
import cross from "../../assets/Icons/Cross.svg";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPeopleData } from "../../app/features/peopleTableSlice";
import { RootState } from "../../app/store";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_URL;

const PeopleTable = ({ search="", gender="", approveStatus="" }) => {
  const dispatch = useDispatch();
  const [userApproved, setUserApproved] = useState(null);
  const [userRejected, setUserRejected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const offset = (currentPage - 1) * recordsPerPage;
    dispatch(
      fetchPeopleData({
        limit: recordsPerPage,
        offset,
        search,
        gender,
        approveStatus,
      })
    );
  }, [
    currentPage,
    userApproved,
    userRejected,
    search,
    gender,
    approveStatus,
    dispatch,
  ]);

  const { peopleData, status, error } = useSelector(
    (state: RootState) => state.peopleTable
  );

  const handleApprove = async (profileSlug) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Token ${token}`,
      };

      const response = await axios.patch(
        `${BASE_URL}/accounts/profile/${profileSlug}/approve/`,
        null,
        { headers }
      );
      setUserApproved(response.data);
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleReject = async (profileSlug) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Token ${token}`,
      };

      const response = await axios.patch(
        `${BASE_URL}/accounts/profile/${profileSlug}/reject/`,
        null,
        { headers }
      );
      setUserRejected(response.data);
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  const recordsPerPage = 10;

  const totalPages = peopleData
    ? Math.ceil(peopleData.count / recordsPerPage)
    : 0;

  const currentData = peopleData?.results?.length > 0 ? peopleData.results : [];

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const header = [
    { id: 1, title: "Registration Date" },
    { id: 2, title: "Name" },
    { id: 3, title: "Socials" },
    // { id: 4, title: "Channel" },
    { id: 5, title: "Phone Number" },
    { id: 6, title: "Gender" },
    { id: 7, title: "Age" },
    { id: 8, title: "Address" },
    { id: 9, title: "Email" },
    // { id: 10, title: "Point of Interest" },
    { id: 11, title: "Actions" },
  ];
  return (
    <div className="flex flex-col border border-[#FFFFFF1A] rounded-lg w-full">
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p className="text-red-500">{error}</p>}
      {status === "succeeded" && (
        <>
          <div className="overflow-x-auto scrollbar">
            <table className="min-w-[1750px]">
              <thead>
                <tr className="grid grid-cols-9 items-center bg-[#FFFFFF1A] rounded-t-lg w-full">
                  {header.map((item) => (
                    <th
                      key={item.id}
                      className="text-[#65E8BF] text-base font-bold text-left px-5 py-3 h-full border-b border-[#FFFFFF1A]"
                    >
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="w-full">
                {currentData?.length > 0 ? (
                  currentData.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`grid grid-cols-9 items-center text-[#FFFFFF] font-normal text-base w-full ${
                        idx % 2 === 0 ? "bg-[#565676]" : "bg-[#454363]"
                      }`}
                    >
                      <td className="px-6 py-4">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString(
                              "en-GB"
                            )
                          : "-"}
                      </td>
                      <td className="px-6 py-4 cursor-pointer hover:underline">
                        {item.user.name ? item.user.name : "-"}
                      </td>
                      <td className="flex flex-col gap-1 px-6 py-4">
                        {item.social_media ? (
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-[#F4EBFF] object-cover"></div>
                            <a
                              href="https://www.facebook.com/"
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline"
                            >
                              Facebook
                            </a>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      {/* <td className="px-6 py-4">
                    <div
                      className={`w-fit px-2 py-0.5 leading-[18px] rounded-2xl text-[12px] font-medium capitalize ${
                        item.channel === "invited"
                          ? "bg-[#F9F5FF] text-[#CC065B]"
                          : item.channel === "self"
                          ? "bg-[#A6F4C5] text-[#039855]"
                          : ""
                      }`}
                    >
                      {item.channel || "-"}
                    </div>
                  </td> */}
                      <td className="px-6 py-4">{item.phone || "-"}</td>
                      <td className="px-6 py-4">{item.gender || "-"}</td>
                      <td className="px-6 py-4">{item.age || "-"}</td>
                      <td className="px-6 py-4 flex items-centeroverflow-x-scroll no-scrollbar">
                        {item.municipality && item.district && item.province
                          ? `${item.municipality}, ${item.district}, ${item.province}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 flex items-center overflow-x-scroll no-scrollbar ">
                        {item.email || "-"}
                      </td>
                      {/* <td className="px-6 py-4">
                        {item.pointOfInterest || "-"}
                      </td> */}
                      <td className="flex items-center gap-2 px-6 py-4 border-l border-[#FFFFFF33] sticky right-0 bg-inherit w-full h-full">
                        {item.status === "Accepted" ? (
                          <div className="flex items-center gap-2">
                            <div className="bg-[#F4EBFF] rounded-full p-[10px]">
                              <img src={tick} alt="Approved" />
                            </div>
                            <span className="text-[#65E8BF] text-sm font-semibold">
                              Approved
                            </span>
                          </div>
                        ) : item.status === "Rejected" ? (
                          <div className="flex items-center gap-2">
                            <div className="bg-[#F4EBFF] rounded-full p-[10px]">
                              <img src={cross} alt="Rejected" />
                            </div>
                            <span className="text-[#FB7052] text-sm font-semibold">
                              Rejected
                            </span>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              className="text-[#65E8BF] text-sm font-semibold"
                              onClick={() => handleApprove(item.slug)}
                            >
                              Approve
                            </button>
                            <button
                              className="text-[#FB7052] text-sm font-semibold"
                              onClick={() => handleReject(item.slug)}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={header.length}
                      className="text-center py-4 text-white"
                    >
                      No data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* pagenation */}

          {/* <div className="bg-[#303050] rounded-b-lg">
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              gotoButton={true}
            />
          </div> */}
          <div className="flex items-center justify-between px-4 py-2 text-white ">
            <div className="flex gap-[10px]">
              <button
                className={`px-4 py-2 rounded-lg bg-[#454363] hover:bg-[#565676] text-sm font-medium ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className={`px-4 py-2 rounded-lg bg-[#454363] hover:bg-[#565676] text-sm font-medium ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

            <div className="flex gap-[50px]">
              <div className="flex items-center gap-2 text-sm">
                <span>Goto Page</span>
                <input
                  type="number"
                  value={currentPage}
                  className="w-12 px-2 py-1 text-center rounded-lg bg-[#303050] border border-[#FFFFFF1A]"
                />
              </div>

              <div className="flex items-center gap-2 text-sm font-[700]">
                <span>Page</span>
                {currentPage}
                <span>of</span>
                {totalPages}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PeopleTable;
