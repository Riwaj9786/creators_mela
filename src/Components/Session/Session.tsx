import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Upload from "../../assets/Icons/DownloadImg.svg";
import Frame from "../../assets/Images/FrameImg.png";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

type Inputs = {
  id: number;
  session_name: string;
  banner: File;
  description: string;
  date: Date;
  total_seats: number;
  start_time: any;
  end_time: any;
  hall: number;
  speakers: { value: number; label: string }[];
  performers: { value: number; label: string }[];
};

const BASE_URL = import.meta.env.VITE_APP_URL;

const Session = () => {
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [performers, setPerformers] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [selectedSpeakers, setSelectedSpeakers] = useState<
    { value: number; label: string }[]
  >([]);
  const [selectedPerformers, setSelectedPerformers] = useState<
    { value: number; label: string }[]
  >([]);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const token = localStorage.getItem("token");

  // for fetching spaeker data
  // for fetching Performers data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [speakersRes, performersRes] = await Promise.all([
          axios.get(`${BASE_URL}/people/speakers/`),
          axios.get(`${BASE_URL}/people/performers/`),
        ]);
        setSpeakers(speakersRes.data.results || []);
        setPerformers(performersRes.data.results || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const performersOptions = performers.map((performer) => ({
    value: performer.id,
    label: performer.user?.name || "Unknown Performer",
  }));
  const speakersOptions = speakers.map((speaker) => ({
    value: speaker.id,
    label: speaker.user?.name || "Unknown Performer",
  }));

  console.log(speakers, "asdgasd");
  // const onSubmit: SubmitHandler<Inputs> = async (data) => {
  //   try {
  //     console.log({
  //       session_name: data.session_name,
  //       banner: data.banner[0],
  //       description: data.description,
  //       date: data.date,
  //       total_seats: data.total_seats,
  //       start_time: data.start_time,
  //       end_time: data.end_time,
  //       hall: data.hall,
  //       speakers: selectedSpeakers.map((speaker) => speaker.value),
  //       performers: selectedPerformers.map((performer) => performer.value),
  //     });
  //     const response = await axios.post(
  //       `${BASE_URL}/events/session/create/`,
  //       {
  //         session_name: data.session_name,
  //         banner: data.banner[0],
  //         description: data.description,
  //         date: data.date,
  //         total_seats: data.total_seats,
  //         start_time: data.start_time,
  //         end_time: data.end_time,
  //         hall: data.hall,
  //         speakers: selectedSpeakers.map((speaker) => speaker.value),
  //         performers: selectedPerformers.map((performer) => performer.value),
  //       },
  //       {
  //         headers: {
  //           Authorization: `Token ${token}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     const slug = response.data.slug;

  //     console.log(slug, "slug");

  //     reset();
  //     setFormStatus("Session created successfully!");
  //     // navigate(`/SessionPreview/${slug}`);
  //   } catch (error: unknown) {
  //     const errorMessage =
  //       axios.isAxiosError(error) && error.response?.data?.message
  //         ? error.response.data.message
  //         : "Session creation failed. Please try again.";
  //     setFormStatus(errorMessage);
  //   }
  // };
  const onSubmit = async (data) => {
    try {
      // Create FormData object
      const formData = new FormData();
      console.log("formData", formData);
      // Append basic fields
      formData.append("session_name", data.session_name);
      formData.append("description", data.description);
      formData.append("date", data.date);
      formData.append("total_seats", data.total_seats);
      formData.append("start_time", data.start_time);
      formData.append("end_time", data.end_time);
      formData.append("hall", data.hall);

      // Append the banner file (if provided)
      if (data.banner && data.banner[0]) {
        formData.append("banner", data.banner[0]);
      }

      // Append speakers (array of IDs)
      selectedSpeakers.forEach((speaker) =>
        formData.append("speakers", speaker.value)
      );

      // Append performers (array of IDs)
      selectedPerformers.forEach((performer) =>
        formData.append("performers", performer.value)
      );

      // Send the POST request
      const response = await axios.post(
        `${BASE_URL}/events/session/create/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`, 
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const slug = response.data.slug;
      navigate(`/SessionPreview/${slug}`);
    } catch (error) {
      // Handle errors
      console.error(
        "Error creating session:",
        error.response?.data || error.message
      );
      alert("Failed to create session. Please try again.");
    }
  };

  return (
    <div className="w-full flex gap-[17px] ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="flex justify-between  w-full gap-[17px]"
      >
        <div className="w-[377px] flex flex-col gap-y-[32px] bg-[#FFFFFF1A] rounded-[16px] border border-[#FFFFFF33] shadow-[#0D092840] p-[21px] h-full ">
          <div className="flex flex-col h-full ">
            <div className="flex flex-col justify-center gap-[20px]">
              {/* Session Name Field */}
              <div className="flex flex-col">
                <span className="text-[18px] font-[400] text-[#FFFFFF]">
                  Session Name
                </span>
                <input
                  aria-label="session_name"
                  {...register("session_name", {
                    required: "This field is required",
                  })}
                  placeholder="Enter Session Name"
                  className="rounded-[10px] h-[64px] w-[331px] border border-[#FFFFFF80] font-[500] text-[16px] px-2 bg-[#FFFFFFB2]"
                />
                {errors.session_name && (
                  <p className="text-red-500 text-sm" id="name-error">
                    {errors.session_name.message}
                  </p>
                )}
              </div>

              {/* Session Date Field */}
              <div className="flex flex-col">
                <span className="text-[18px] font-[400] text-[#FFFFFF]">
                  Session Date
                </span>
                <input
                  type="date"
                  aria-label="date"
                  {...register("date", {
                    required: "Select Session Date",
                  })}
                  className="rounded-[10px] h-[64px] w-[331px] border border-[#FFFFFF80] font-[500] text-[16px] px-2 bg-[#FFFFFFB2]"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm" id="name-error">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Session Start Time Field */}
              <div className="flex flex-col">
                <span className="text-[18px] font-[400] text-[#FFFFFF]">
                  Session Start Time
                </span>
                <input
                  type="time"
                  aria-label="start_time"
                  {...register("start_time", {
                    required: "This field is required",
                  })}
                  className="rounded-[10px] h-[64px] w-[331px] border border-[#FFFFFF80] font-[500] text-[16px] px-2 bg-[#FFFFFFB2]"
                />
                {errors.start_time && (
                  <p className="text-red-500 text-sm" id="name-error">
                    {errors.start_time.message}
                  </p>
                )}
              </div>

              {/* Session End Time Field */}
              <div className="flex flex-col">
                <span className="text-[18px] font-[400] text-[#FFFFFF]">
                  Session End Time
                </span>
                <input
                  type="time"
                  aria-label="end_time"
                  {...register("end_time", {
                    required: "This field is required",
                  })}
                  className="rounded-[10px] h-[64px] w-[331px] border border-[#FFFFFF80] font-[500] text-[16px] px-2 bg-[#FFFFFFB2]"
                />
                {errors.end_time && (
                  <p className="text-red-500 text-sm" id="name-error">
                    {errors.end_time.message}
                  </p>
                )}
              </div>

              {/* Event Hall Field */}
              <div className="flex flex-col">
                <span className="text-[18px] font-[400] text-[#FFFFFF]">
                  Event Hall
                </span>
                <select
                  {...register("hall", { required: "Please select a hall" })}
                  className="rounded-[10px] h-[64px] w-[331px] border border-[#FFFFFF80] font-[500] text-[16px] px-2 bg-[#FFFFFFB2]"
                >
                  <option value="">Select Hall</option>
                  <option value="1">Hall A</option>
                  <option value="2">Hall B</option>
                  <option value="3">Hall C</option>
                </select>
                {errors.hall && (
                  <p className="text-red-500 text-sm" id="hall-error">
                    {errors.hall.message}
                  </p>
                )}
              </div>

              {/* Total Seats Field */}
              <div className="flex flex-col">
                <span className="text-[18px] font-[400] text-[#FFFFFF]">
                  Total Seats
                </span>
                <input
                  type="number"
                  aria-label="total_seats"
                  {...register("total_seats", {})}
                  placeholder="Enter Capacity in Number of People"
                  className="rounded-[10px] h-[64px] w-[331px] border border-[#FFFFFF80] font-[500] text-[16px] px-2 bg-[#FFFFFFB2]"
                />
                {errors.total_seats && (
                  <p className="text-red-500 text-sm" id="seats-error">
                    {errors.total_seats.message}
                  </p>
                )}
              </div>

              {/* Speakers Field */}
              <div className="flex flex-col">
                <span className="text-[18px] font-[400] text-[#FFFFFF]">
                  Speakers
                </span>
                <Select
                  isMulti
                  options={speakersOptions}
                  value={selectedSpeakers}
                  onChange={setSelectedSpeakers}
                  placeholder="Select Speakers"
                  classNamePrefix="react-select"
                  className="rounded-[10px] border-[#FFFFFF80] text-black"
                />
                {errors.speakers && (
                  <p className="text-red-500 text-sm" id="speakers-error">
                    {errors.speakers.message}
                  </p>
                )}
                {selectedSpeakers.length > 0 && (
                  <div className="text-[#FFFFFF] mt-2 text-sm">
                    <ul className="list-disc ml-4">
                      {selectedSpeakers.map((speaker) => (
                        <li key={speaker.value}>{speaker.label}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* <div className="flex flex-col">
              <span className="text-[18px] font-[400] text-[#FFFFFF]">
                Speakers
              </span>
              <select
                aria-label="speakers"
                {...register("speakers", {})}
                className="rounded-[10px] h-[64px] w-[331px] border border-[#FFFFFF80] font-[500] text-[16px] px-2 bg-[#FFFFFFB2] text-black"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a Speakers
                </option>
                {performers.map((performer, index) => (
                  <option key={index} value={performer.user?.name || ""}>
                    {performer.user?.name || "Unknown Performer"}
                  </option>
                ))}
              </select>
              {errors.speakers && (
                <p className="text-red-500 text-sm" id="speakers-error">
                  {errors.speakers.message}
                </p>
              )}
            </div> */}

              {/* Performers Field */}
              <div className="flex flex-col">
                <span className="text-[18px] font-[400] text-[#FFFFFF]">
                  Performers
                </span>
                <Select
                  isMulti
                  options={performersOptions}
                  value={selectedPerformers}
                  onChange={setSelectedPerformers}
                  placeholder="Select Performers"
                  classNamePrefix="react-select"
                  className="rounded-[10px] border-[#FFFFFF80] text-black"
                />
                {errors.performers && (
                  <p className="text-red-500 text-sm" id="speakers-error">
                    {errors.performers.message}
                  </p>
                )}
                {selectedPerformers.length > 0 && (
                  <div className="text-[#FFFFFF] mt-2 text-sm">
                    <ul className="list-disc ml-4">
                      {selectedPerformers.map((performer) => (
                        <li key={performer.value}>{performer.label}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {/* <div className="flex flex-col">
              <span className="text-[18px] font-[400] text-[#FFFFFF]">
                Performers
              </span>
              <input
                type="text"
                aria-label="performers"
                {...register("performers", {})}
                placeholder="Enter Performers"
                className="rounded-[10px] h-[64px] w-[331px] border border-[#FFFFFF80] font-[500] text-[16px] px-2 bg-[#FFFFFFB2]"
              />
              {errors.performers && (
                <p className="text-red-500 text-sm" id="performers-error">
                  {errors.performers.message}
                </p>
              )}
            </div> */}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col justify-between bg-[#FFFFFF1A] rounded-[16px] border border-[#FFFFFF33] shadow-[#0D092840] p-[21px] h-full ">
          {/* Banner Image Upload */}
          <div className="flex flex-col gap-y-[32px]">
            <div className="flex w-full justify-between h-[153px]">
              <div className="flex flex-col max-w-[280px]">
                <h1 className="text-[#F4F3F6] text-[14px] font-[500]">
                  Banner
                </h1>
                <span className="text-[#B1AEC2] text-[14px] font-[400]">
                  Add Banner to display for Session Page
                </span>
              </div>

              <div className="flex items-center justify-center flex-col h-[126px] bg-gradient-to-b from-[#78C5F129] via-[#E8E8E83B] to-[#00000014] shadow-[#0D092840] border border-[#FFFFFF33] rounded-[8px]">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  {...register("banner", {})}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center cursor-pointer space-x-2 justify-center flex-col"
                >
                  <img src={Upload} alt="Upload Icon" />
                  <p className="w-1/2">
                    <span className="text-[#65E8BF] text-[14px] font-[600]">
                      Click to Upload{" "}
                    </span>
                    <span className="text-[#FFFFFF] text-[14px] font-[400]">
                      or drag and drop PNG or JPG
                    </span>
                  </p>
                </label>
              </div>
              <img src={Frame} alt="Frame" />
            </div>
            {/* Banner Thumbnail Static design nothing to send to API*/}
            <div className="flex w-full justify-between h-[153px]">
              <div className="flex flex-col max-w-[280px]">
                <h1 className="text-[#F4F3F6] text-[14px] font-[500]">
                  Banner Thumbnail
                </h1>
                <span className="text-[#B1AEC2] text-[14px] font-[400]">
                  Add Thumbnail to display for Homepage of the app
                </span>
              </div>
              <div className="flex items-center justify-center flex-col h-[126px] bg-gradient-to-b from-[#78C5F129] via-[#E8E8E83B] to-[#00000014] shadow-[#0D092840] border border-[#FFFFFF33] rounded-[8px]">
                <img src={Upload} alt="Upload" />
                <p className="w-1/2">
                  <span className="text-[#65E8BF] text-[14px] font-[600]">
                    Click to Upload{" "}
                  </span>
                  <span className="text-[#FFFFFF] text-[14px] font-[400]">
                    or drag and drop PNG or JPG
                  </span>
                </p>
              </div>
              <img src={Frame} alt="Frame" />
            </div>
            {/* Description Upload */}
            <div className="flex w-full gap-[100px] h-[153px] ">
              <div className="flex flex-col max-w-[280px] ">
                <h1 className="text-[#F4F3F6] text-[14px] font-[500]">
                  Description
                </h1>
                <span className="text-[#B1AEC2] text-[14px] font-[400]">
                  Add Session Description to be displayed with the Session
                  Detail
                </span>
              </div>

              {/* Textarea for Description */}
              <div className="relative w-[400px] ">
                <textarea
                  {...register("description", {
                    maxLength: {
                      value: 500,
                      message: "Maximum character limit is 500.",
                    },
                    // required: "This field is required",
                  })}
                  placeholder="Enter Session Description"
                  className="w-full h-[120px] rounded-[10px] border border-[#FFFFFF80] bg-[#FFFFFFB2] text-[#000000] font-[400] text-[14px] p-3 resize-none"
                  onChange={(e) => setDescription(e.target.value)} // Local state to track input
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}

                {/* Character count */}
                <span className="absolute bottom-2 right-3 text-[#B1AEC2] text-[12px] font-[400]">
                  {description.length}/500 Characters
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end ">
            <div className="flex justify-center  ">
              <button
                type="submit"
                disabled={isSubmitting}
                className={` bg-[#65E8BF] hover:bg-[blue] text-[#110D2F] font-[500] text-[24px] rounded-[15px] h-[65px] w-[346px]`}
              >
                {isSubmitting ? "Submitting..." : "Create a Session       >"}
              </button>
            </div>
            {formStatus && (
              <p className="text-center text-sm pt-[16px] text-white">
                {formStatus}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Session;
