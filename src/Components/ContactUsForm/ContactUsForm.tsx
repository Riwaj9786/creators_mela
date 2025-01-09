import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";

type Inputs = {
  Name: string;
  Email: string;
  Message: string;
};

const BASE_URL = import.meta.env.VITE_APP_URL;

const ContactUsForm = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const [formStatus, setFormStatus] = useState<string | null>(null);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await axios.post(`${BASE_URL}/contact/message/create/`, {
        name: data.Name,
        email: data.Email,
        message: data.Message,
      });
      reset();
      setFormStatus("Message sent successfully!");
    } catch (error: unknown) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Message submission failed. Please try again.";
      setFormStatus(errorMessage);
    }
  };

  return (
    <div className="rounded-[20px] bg-gradient-to-b from-[#78C5F129] to-[#E8E8E83B] h-full min-h-[751px] w-full max-w-[553px] p-[35px] border-[1px] border-[#FFFFFF4D]">
      <div className="leading-none gap-[12px]">
        <h1 className="text-white text-[24px] font-[500] ">Contact Us</h1>
      </div>
      <div className="pt-[16px]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="flex flex-col justify-center gap-[20px]">
            {/* Name Field */}
            <div className="flex flex-col">
              <span className="text-[18px] font-[400] text-[#FFFFFF]">
                Name
              </span>
              <input
                aria-label="Name"
                {...register("Name", {
                  required: "This field is required",
                })}
                placeholder="Enter Your Name"
                className="rounded-[10px] h-[62px] max-w-[598px] border-[2px] border-[#AEADB3] font-[500] text-[16px] px-2 bg-[#FFFFFF]"
              />
              {errors.Name && (
                <p className="text-red-500 text-sm" id="name-error">
                  {errors.Name.message}
                </p>
              )}
            </div>
            {/* Email Field */}
            <div className="flex flex-col">
              <span className="text-[18px] font-[400] text-[#FFFFFF]">
                Email
              </span>
              <input
                aria-label="Email"
                {...register("Email", {
                  required: "This field is required",
                })}
                placeholder="Enter your Email"
                className="rounded-[10px] h-[62px] max-w-[598px] border-[2px] border-[#B1AEC2]  font-[500] text-[16px] px-2 bg-[#FFFFFF]"
              />
              {errors.Email && (
                <p className="text-red-500 text-sm" id="email-error">
                  {errors.Email.message}
                </p>
              )}
            </div>
            {/* Message Field */}
            <div className="flex flex-col">
              <span className="text-[18px] font-[400] text-[#FFFFFF]">
                Message
              </span>
              <textarea
                aria-label="Message"
                {...register("Message", {
                  required: "This field is required",
                })}
                placeholder="Enter your Message"
                className="rounded-[10px] w-full max-w-[598px] border-[2px] border-[#B1AEC2] font-[500] text-[16px] px-2 bg-[#FFFFFF] align-text-top sm:min-h-[150px] sm:max-w-full"
              />
              {errors.Message && (
                <p className="text-red-500 text-sm" id="message-error">
                  {errors.Message.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-center pt-[32px]">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting ? "bg-gray-400" : "bg-[#CC065B]"
              } text-white font-[500] text-[20px] rounded-[20px] h-[80px] w-[598px]`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
          {formStatus && (
            <p className="text-center text-sm pt-[16px] text-white">
              {formStatus}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactUsForm;
