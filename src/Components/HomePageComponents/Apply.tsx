import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_APP_URL;

const Apply = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setFormError(null);
    try {
      const response = await axios.post(`${BASE_URL}/accounts/user/apply/`, {
        name: data.name,
        email: data.email,
      });

      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/RegistrationPage");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.email) {
          setFormError(error.response.data.email[0]);
        } else {
          setFormError("An error occurred. Please try again.");
        }
      } else {
        setFormError("Message submission failed. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[20px] bg-gradient-to-b from-[#78C5F129] to-[#E8E8E83B]  border-[1px] border-[#FFFFFF4D] shadow-[#0D092840] backdrop-blur-[48px]"
    >
      <div className="bg-[#00000014] py-[44px] px-[32px] ">
        <div className="flex flex-col gap-[12px] leading-[1.2]">
          <h1 className="text-[#65E8BF] text-[32px] md:text-[40px] font-[700]">
            Are you an aspiring content creator?
          </h1>
          <h2 className="text-white text-[16px] font-[400]  leading-none">
            Then, Creators Mela 2024 is for you.
          </h2>
        </div>
        {formError && (
          <p className="text-red-500 text-sm mt-[16px]">{formError}</p>
        )}
        <div className="flex flex-col gap-[26px] mt-[26px]">
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="name" className="text-white text-[18px] font-[400]">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your Name"
              className={`rounded-[8px] h-[62px] pl-[19px] ${
                errors.name ? "border-red-500" : ""
              }`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-[8px]">
            <label
              htmlFor="email"
              className="text-white text-[18px] font-[400]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your Email"
              className={`rounded-[8px] h-[62px] pl-[19px] ${
                errors.email ? "border-red-500" : ""
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
        </div>
        <div className="w-full flex justify-center ">
          <button
            type="submit"
            className="flex justify-center items-center h-[80px] w-[290px] rounded-[84px] bg-[#E02C79] mt-[32px] "
          >
            <span className="text-white text-[18px] font-[400] ">
              Apply to join
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Apply;
