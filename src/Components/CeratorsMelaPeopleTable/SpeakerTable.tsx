// import { teamData } from "../../assets/ComponentsData/TeamData";
import { useEffect, useState } from "react";
// import Pagination from "../Pagination/Pagination";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_URL;

const SpeakerTable = ({ search }) => {
  // const [currentPage, setCurrentPage] = useState(1);
  const [speakerData, setSpeakerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  const limit = recordsPerPage;
  const offset = (currentPage - 1) * recordsPerPage;

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const searchQuery = search ? `&search=${search}` : "";
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/people/speaker/list/?limit=${limit}&offset=${offset}${searchQuery}`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const results = response.data;

        setSpeakerData(results);
      } catch (error) {
        console.error("Error fetching performers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpeakers();
  }, [search, currentPage]);

  // console.log(speakerData, "speakre");

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalPages = speakerData
    ? Math.ceil(speakerData.count / recordsPerPage)
    : 0;

  const currentData =
    speakerData?.results?.length > 0 ? speakerData.results : [];

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
  // const recordsPerPage = 10;

  // const totalPages = Math.ceil(teamData.length / recordsPerPage);

  // const speakerData = teamData.slice(
  //   (currentPage - 1) * recordsPerPage,
  //   currentPage * recordsPerPage
  // );

  // const handleNext = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const handlePrevious = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  const header = [
    { id: 1, title: "Name" },
    { id: 2, title: "Email" },
    // { id: 3, title: "Invitation Date" },
    { id: 4, title: "Registration Date" },
  ];

  return (
    <div className="flex flex-col border border-[#FFFFFF1A] rounded-lg w-2/3">
      <div className="overflow-x-auto scrollbar">
        <table className="table-auto w-full">
          <thead>
            <tr className="grid grid-cols-3 bg-[#FFFFFF1A] rounded-t-lg">
              {header.map((item) => (
                <th
                  key={item.id}
                  className={`text-[#65E8BF] text-base font-bold text-left px-5 py-3 border-b border-[#FFFFFF1A]`}
                >
                  {item.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, idx) => (
                <tr
                  key={idx}
                  className={`grid grid-cols-3 items-center text-[#FFFFFF] font-normal text-base ${
                    idx % 2 === 0 ? "bg-[#565676]" : "bg-[#454363]"
                  }`}
                >
                  <td className="px-5 py-4 cursor-pointer hover:underline">
                    {item.user.name || "-"}
                  </td>
                  <td className="px-5 py-4 overflow-x-scroll no-scrollbar">
                    {item.user.email || "-"}
                  </td>
                  {/* <td className="px-5 py-4">
                    {item.invitationDate
                      ? new Date(item.invitationDate).toLocaleDateString(
                          "en-GB"
                        )
                      : "-"}
                  </td> */}
                  <td className="px-5 py-4">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString("en-GB")
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="grid grid-cols-3">
                <td
                  colSpan={header.length}
                  className="text-center py-4 text-white col-span-4"
                >
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
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

      {/* {teamData.length > 0 && (
        <div className="bg-[#303050] rounded-b-lg">
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            gotoButton={true}
          />
        </div>
      )} */}
    </div>
  );
};

export default SpeakerTable;
