import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  Otp: number;
};

const Otp = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // console.log(data);
    reset();
  };

  return (
    <div className="flex flex-col justify-center items-center h-[466px] w-[504px] border-[2px] border-[#78C5F129] rounded-[50px] bg-gradient-to-b from-[#78C5F129] via-[#E8E8E83B] to-[#0000007A] shadow-[#0D092840] backdrop-blur-2xl transition-all gap-[47px]">
      <h1 className="font-[700] text-[40px] text-[#FFFFFF]">OTP</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col ">
        <div className="flex flex-col justify-center gap-[9px]">
          <div>
            <input
              {...register("Otp", {
                required: "This field is required",
              })}
              placeholder="OTP"
              className="rounded-[10px] h-[68px] w-[443px] border-[2px] border-[#B1AEC2] bg-transparent font-[500] text-[15px] px-2"
            />
            {errors.Otp && (
              <p className="text-red-500 text-sm">{errors.Otp.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <span className="cursor-pointer text-[#65E8BF] text-[16px] font-[400]">
              resend OTP
            </span>
          </div>
        </div>
        <div className="flex justify-center pt-[65px]">
          <button
            type="submit"
            className="bg-[#65E8BF] text-[#291F6F] font-[500] text-[20px] rounded-[20px] h-[85.31px] w-[444px]"
          >
            Verify OTP
          </button>
        </div>
      </form>
    </div>
  );
};

export default Otp;
