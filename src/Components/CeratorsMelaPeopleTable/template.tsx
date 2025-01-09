import React, { useEffect, useState } from "react";
import AnalyticsPagination from "../../components/Analytics/AnalyticsPagination";
import linkIcon from "../../assets/icon/link.svg";
import Modal from "../../components/People/Modal/Modal";
import tick from "../../assets/icon/TickCircle.svg";
import cross from "../../assets/icon/CrossCircle.svg";
import HttpBrowsing from "../../utils/HttpBrowsing";
import searchIcon from "../../assets/icon/Search.svg";
import Select from "../../components/People/Select";
import refreshIcon from "../../assets/icon/Refresh.svg";
import downloadIcon from "../../assets/icon/DownloadFile.svg";
import { toast } from "sonner";
import Close from "../../assets/Close";
import { getTitleFromId } from "../../utils/UtilityFunctions/helperFunctions";
import Loader from "react-js-loader";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../components/EmptyState";
const VITE_APP_BACKEND = import.meta.env.VITE_APP_BACKEND_URL;
const header = [
  {
    id: 1,
    title: "Registration Date",
  },
  {
    id: 2,
    title: "Name",
  },
  {
    id: 3,
    title: "Socials",
  },
  {
    id: 4,
    title: "Channel",
  },
  {
    id: 5,
    title: "Phone Number",
  },
  {
    id: 6,
    title: "Gender",
  },
  {
    id: 7,
    title: "Age",
  },
  {
    id: 8,
    title: "Address",
  },
  {
    id: 9,
    title: "Email",
  },
  {
    id: 10,
    title: "Point of Interest",
  },
  {
    id: 11,
    title: "Actions",
  },
];

const Guests = ({
  isOpen,
  setIsOpen,
  genderList,
  provinceList,
  districtList,
  municipalityList,
  invite,
  setInvite,
  setCheckDisableInviteButton,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [guestData, setGuestData] = useState(null);
  const [gender, setGender] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [fetching, setFetching] = useState(true);
  const [rejectedEmail, setRejectedEmail] = useState(null);
  const [downloadLoader, setDownloadLoader] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  const [selectedRejectRow, setSelectedRejectRow] = useState(null);

  const openModal = () => {
    setInvite(true);
    setIsOpen(true);
  };
  const closeModal = () => {
    setRejectedEmail("");
    setIsOpen(false);
    setTimeout(() => setInvite(false), 300);
    setCheckDisableInviteButton(true);
    setTimeout(() => setCheckDisableInviteButton(false), 500);
    // setInvite(false);
  };

  const handleReject = (idx, email) => {
    setRejectedEmail(email);
    setSelectedRejectRow(idx);
    setIsOpen(true);
  };
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleGenderFilterChange = (selectedValue) => {
    setSelectedGender(selectedValue);
  };

  useEffect(() => {
    HttpBrowsing.get(`/profiles/genders`).then((res) => {
      setGender(res?.data);
    });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      fetchGuestData(currentPage);
    }
  }, [currentPage, searchQuery, selectedGender, selectedStatus, isOpen]);

  const fetchGuestData = (page) => {
    const limit = 10;
    const offset = (page - 1) * limit;
    const queryParams = { limit, offset };
    if (searchQuery?.trim() !== "") {
      queryParams.search = searchQuery.trim();
    }
    if (selectedGender !== "") {
      queryParams.gender = selectedGender;
    }
    if (selectedStatus !== "") {
      queryParams.approval_status = selectedStatus;
    }
    HttpBrowsing.get(`/people/guests/`, queryParams)
      .then((res) => {
        setGuestData(res?.data);
      })
      .catch((error) => {
        // console.log("Error", error);
        toast.error("default", {
          title: "Error Occured!",
          description: "Some error occured while fetching data",
          cancel: {
            label: <div className="w-5 text-2xl">&#10799;</div>,
            onClick: () => null,
          },
        });
      })
      .finally(() => {
        setFetching(false);
      });
  };
  const handleReload = () => {
    setSearchQuery("");
    setSelectedGender("");
    setSelectedStatus("");
  };
  const handleNext = () => {
    if (guestData?.next) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (guestData?.previous) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleClick = (email, approve, message) => {
    HttpBrowsing.post(`/people/guests/send-approval-status/`, {
      email: email,
      approve: approve,
    })
      .then(() => {
        toast.success("default", {
          title: "Success",
          description: message,
          cancel: {
            label: <Close />,
          },
        });

        setRejectedEmail("");
        closeModal();
        fetchGuestData(currentPage);
      })
      .catch((error) => {
        console.error("Error:", error);
        // setRejectedEmail("");
        toast.error("Error", {
          cancel: {
            label: <Close />,
          },
        });
      });
  };
  const WindowHandleClick = (id) => {
    if (id) navigate(`/people/profile/${id}`);
  };
  function ensureHttps(url) {
    if (url.startsWith("http://")) {
      return url.replace("http://", "https://");
    } else if (url.startsWith("https://")) {
      return url;
    } else {
      return "https://" + url;
    }
  }
  const handleDownload = async () => {
    setDownloadLoader(true);
    try {
      // API endpoint that returns the CSV file
      const response = await fetch(
        `${VITE_APP_BACKEND}/people/guests-csv/?approval_status=${selectedStatus}&gender=${selectedGender}`,
        {
          headers: {
            "Content-Type": "text/csv",
            Authorization:
              "Token " + localStorage.getItem("creators_mela_token"),
          },
        }
      );

      if (!response.ok) {
        setDownloadLoader(false);
        throw new Error("Network response was not ok");
      }

      // Get the CSV data as text
      const csvData = await response.text();

      // Create a Blob from the CSV data
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

      // Create a temporary anchor element and trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = timestamp;
      a.click();

      // Revoke the URL to free up memory
      URL.revokeObjectURL(url);
      setDownloadLoader(false);
    } catch (error) {
      setDownloadLoader(false);
      toast.error("default", {
        title: "Error",
        description: "Their was problem on download,please try again",
        cancel: {
          label: <Close />,
        },
      });
    }
  };
  return (
    <div className="w-full flex flex-col gap-2 ">
      <div className="flex justify-between w-full">
        <div className="flex flex-col mdl:flex-row gap-6 w-full ">
          <div className="w-[331px]">
            <span className="text-[12px] text-[#FFFFFF] font-normal">
              Search
            </span>
            <div className="flex justify-between bg-[#FFFFFFB2] border border-[#FFFFFF80] rounded-lg px-3  py-4 w-full">
              <input
                type="text"
                placeholder="Search People"
                className="focus:outline-none w-full bg-[#BAB9C7] focus:bg-[#BAB9C7] placeholder:text-[#17113D]"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <img src={searchIcon} alt="" />
            </div>
          </div>
          <div className="flex items-end w-full">
            <div className="flex items-end gap-1">
              <Select
                title="Gender"
                placeholder="Select Gender"
                options={gender}
                value={selectedGender}
                onChange={handleGenderFilterChange}
              />
              <Select
                title="Approval Status"
                placeholder="Select Status"
                options={[
                  { title: "Approved", id: "approved" },
                  { title: "Pending", id: "pending" },
                  { title: "Rejected", id: "rejected" },
                ]}
                value={selectedStatus}
                onChange={(selectedValue) => setSelectedStatus(selectedValue)}
              />
              <div
                role="button"
                onClick={handleReload}
                className="w-full h-full"
              >
                <img src={refreshIcon} alt="" />
              </div>
            </div>
          </div>
        </div>

        <div
          role="button"
          className="w-fit h-fit flex items-center self-end px-3 py-2 text-[#65E8BF] text-base font-normal border border-[#65E8BF] gap-4 rounded-xl relative"
          onClick={() => {
            if (!downloadLoader) {
              handleDownload();
            }
          }}
        >
          {downloadLoader ? (
            <div className="absolute">
              <Loader
                type="spinner-cub"
                bgColor={"white"}
                color={"white"}
                size={30}
              />
            </div>
          ) : (
            ""
          )}
          <span className="hidden lg:inline-block">
            {downloadLoader ? "Downloading..." : "Download"}
          </span>
          <div className="w-5 h-5">
            <img src={downloadIcon} alt="" className="w-full h-full" />
          </div>
        </div>
      </div>
      {fetching ? (
        <div
          className={" z-[99] w-full flex items-center justify-center mt-11"}
        >
          <Loader
            type="spinner-cub"
            bgColor={"white"}
            color={"white"}
            title={"Loading Data Please Wait..."}
            size={80}
          />
        </div>
      ) : (
        <div className="flex flex-col border border-[#FFFFFF1A] rounded-lg w-full">
          <div className="overflow-x-auto thin-scrollbar">
            <table className="min-w-[1750px]">
              <thead>
                <tr className="grid grid-cols-11 items-center bg-[#FFFFFF1A] rounded-t-lg w-full  rounded-tr-xl ">
                  {header.map((item) => (
                    <th
                      key={item?.id}
                      className={`text-[#65E8BF] text-base font-bold text-left px-5 py-3 h-full center border-b border-[#FFFFFF1A] rounded-tr-lg w-full ${
                        item?.id === header?.length
                          ? "border-l border-[#FFFFFF33] sticky right-0 bg-[#6A6A80] "
                          : ""
                      }`}
                    >
                      {item?.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="w-full">
                {guestData?.results?.length <= 0 ? (
                  <EmptyState text="No Guest registered yet" />
                ) : (
                  guestData?.results?.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`grid grid-cols-11 items-center text-[#FFFFFF] font-normal text-base w-full ${
                        idx % 2 === 0 ? "bg-[#565676]" : "bg-[#454363]"
                      }`}
                    >
                      <td className="px-6 py-4 h-full w-full flex items-center">
                        {item?.registration_at
                          ? new Date(item?.registration_at).toLocaleDateString(
                              "en-GB"
                            )
                          : "-"}
                      </td>

                      <td
                        onClick={() => WindowHandleClick(item?.profile)}
                        className={`px-6 py-4 h-full w-full flex items-center cursor-pointer ${
                          item?.profile ? " hover:underline" : ""
                        }`}
                      >
                        {item?.fullname ? item?.fullname : "-"}
                      </td>
                      <td className="flex flex-col gap-1 px-6 py-4 ">
                        {item?.facebook ? (
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-[#F4EBFF] object-cover">
                              <img src={linkIcon} alt="link" />
                            </div>
                            <a
                              href={ensureHttps(item?.facebook)}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline"
                            >
                              Facebook
                            </a>
                          </div>
                        ) : null}
                        {item?.instagram ? (
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-[#F4EBFF] object-cover">
                              <img src={linkIcon} alt="link" />
                            </div>
                            <a
                              href={ensureHttps(item?.instagram)}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline"
                            >
                              Instagram
                            </a>
                          </div>
                        ) : null}
                        {item?.twitter ? (
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-[#F4EBFF] object-cover">
                              <img src={linkIcon} alt="link" />
                            </div>

                            <a
                              href={ensureHttps(item?.twitter)}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline"
                            >
                              Twitter
                            </a>
                          </div>
                        ) : null}
                        {item?.youtube ? (
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-[#F4EBFF] object-cover">
                              <img src={linkIcon} alt="link" />
                            </div>
                            <a
                              href={ensureHttps(item?.youtube)}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline"
                            >
                              Youtube
                            </a>
                          </div>
                        ) : null}
                      </td>
                      <td className="px-6 py-4 h-full w-full flex items-center">
                        <div
                          className={`w-fit px-2 py-0.5 leading-[18px] rounded-2xl text-[12px] font-medium capitalize 
                      ${
                        item?.channel === "invited"
                          ? "bg-[#F9F5FF] text-[#CC065B] "
                          : item?.channel === "self"
                          ? "bg-[#A6F4C5] text-[#039855] "
                          : null
                      }`}
                        >
                          {item?.channel ? item?.channel : "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 h-full w-full flex items-center">
                        {item?.phone ? item?.phone : "-"}
                      </td>
                      <td className="px-6 py-4 h-full w-full flex items-center">
                        {item?.gender
                          ? getTitleFromId(item?.gender, gender)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 h-full w-full flex items-center">
                        {item?.age ? item?.age : "-"}
                      </td>
                      <td className="px-6 py-4 h-full w-full flex items-center">
                        {item?.municipality?.title
                          ? item?.municipality?.title + ","
                          : "-"}
                        <br />
                        {item?.district?.title
                          ? item?.district?.title + ","
                          : "-"}
                        <br />
                        {item?.province?.title ? item?.province?.title : "-"}
                      </td>

                      <td
                        // onClick={() => WindowHandleClick(item?.profile)}
                        className="px-6 py-4 h-full w-full flex items-center overflow-x-scroll no-scrollbar"
                      >
                        {item?.email ? item?.email : "-"}
                      </td>
                      <td
                        // onClick={() => WindowHandleClick(item?.profile)}
                        className="px-6 py-4 h-full w-full flex items-center"
                      >
                        {item?.ad_source?.answer
                          ? item?.ad_source?.answer
                          : "-"}
                      </td>
                      <td
                        className={`flex items-center gap-2 px-6 py-4 border-l border-[#FFFFFF33] h-full sticky right-0 bg-inherit `}
                      >
                        {item?.approval_status === "approved" ? (
                          <div className="flex items-center gap-2">
                            <div className="bg-[#F4EBFF] rounded-full p-[10px]">
                              <img
                                src={tick}
                                alt=""
                                className="h-full w-full"
                              />
                            </div>
                            <span className="text-[#65E8BF] text-sm font-semibold">
                              Approved
                            </span>
                          </div>
                        ) : item?.approval_status === "rejected" ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-[#F4EBFF] rounded-full p-[10px]">
                              <img
                                src={cross}
                                alt=""
                                className="h-full w-full"
                              />
                            </div>
                            <span className="text-[#FB7052] text-sm font-semibold">
                              Rejected
                            </span>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <div
                              role="button"
                              onClick={() => {
                                // handleApprove(idx);
                                handleClick(item?.email, true, "Approved");
                              }}
                              className=""
                            >
                              <span className="text-[#65E8BF] text-sm font-semibold">
                                Approve
                              </span>
                            </div>
                            <div
                              role="button"
                              onClick={() => {
                                handleReject(idx, item?.email);
                                // handleClick(item?.email, false, "Rejected");
                              }}
                              className=""
                            >
                              <span className="font-semibold text-sm">
                                Reject
                              </span>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {guestData?.count > 0 && (
            <div className="bg-[#303050] rounded-b rounded-lg">
              <AnalyticsPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={
                  Math.ceil(guestData?.count / 10) > 1
                    ? Math.ceil(guestData?.count / 10)
                    : 1
                }
                handleNext={handleNext}
                handlePrevious={handlePrevious}
                gotoButton={true}
              />
            </div>
          )}
        </div>
      )}
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        setRejectedEmail={setRejectedEmail}
        handleRejection={() => handleClick(rejectedEmail, false, "Rejected")}
        fetchGuestDataFinal={(page) => fetchGuestData(page)}
        invite={invite}
        setInvite={setInvite}
      />
    </div>
  );
};

export default Guests;