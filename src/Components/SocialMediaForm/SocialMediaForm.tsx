import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_URL;

const SocialMediaForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");

      
      const platformMap = {
        Facebook: 1,
        Twitter: 2,
        Instagram: 3,
      };

      console.log(platformMap[data.SocialMedia], "media")

      await axios.post(
        `${BASE_URL}/accounts/media_links/`,
        {
          platform: platformMap[data.SocialMedia],
          url: data.referralSource, 
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      navigate("/RegisterSuccess");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error posting data:", error.response.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="bg-[#FFFFFF66] shadow-[#0D092840] w-[460px] p-4 rounded-md border border-[#FFFFFF33]">
        <h1 className="text-white font-[500] text-[24px]">Social Media</h1>
        <p className="leading-none text-[#17113D] text-[12px] font-[400]">
          Select the profile you want to use to connect with other guests at the
          event
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Social Media */}
          <label className="text-[#17113D] text-[12px] font-[400]">
            Social Media
          </label>
          <select
            {...register("SocialMedia")}
            className="rounded-[8px] h-[46px] w-[331px] border border-[#FFFFFF80] bg-[#FFFFFFB2] font-[400] text-[12px] px-2"
          >
            <option value="" disabled>
              Select Social Media
            </option>
            <option value="Facebook">Facebook</option>
            <option value="Twitter">Twitter</option>
            <option value="Instagram">Instagram</option>
          </select>
          {errors.SocialMedia && (
            <span className="text-red-500 text-xs">
              {errors.SocialMedia.message}
            </span>
          )}

          {/* Add URL */}
          <label className="text-[#17113D] text-[12px] font-[400]">Add URL</label>
          <input
            {...register("referralSource", {
              required: "Please enter a valid URL",
              pattern: {
                value: /^(https?:\/\/[^\s$.?#].[^\s]*)$/i,
                message: "Enter a valid URL",
              },
            })}
            placeholder="Enter the URL"
            className="rounded-[8px] h-[46px] w-[331px] border border-[#FFFFFF80] bg-[#FFFFFFB2] font-[400] text-[12px] px-2"
          />
          {errors.referralSource && (
            <span className="text-red-500 text-xs">
              {errors.referralSource.message}
            </span>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#F4C4D1] text-[#CC065B] font-[700] text-[16px] py-2 px-4 rounded-[84px] mt-4 h-[47px] w-[124px]"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocialMediaForm;
