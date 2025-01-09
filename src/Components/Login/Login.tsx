import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveAuthData } from "../../utils/auth";

type Inputs = {
  Email: string;
  Password: string;
};

const BASE_URL = import.meta.env.VITE_APP_URL;

const Login = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/accounts/login/`, {
        email: data.Email,
        password: data.Password,
      });

      const { token, is_superuser } = response.data;
      if (token) {
        saveAuthData(is_superuser, token);
        reset();
        navigate(is_superuser ? "/PeopleProfile" : "/UserProfile");
      }
    } catch (error: unknown) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Login failed";
      console.error(errorMessage);
    }
  };

  return (
    <>
      <div className=" h-[466px] w-[350px] md:h-[466px] md:w-[504px] border-[2px] border-[#78C5F129] rounded-[50px] bg-gradient-to-b from-[#78C5F129] to-[#E8E8E83B] shadow-[#0D092840] backdrop-blur-2xl transition-all ">
        <div className="w-full flex flex-col justify-center items-center gap-[47px] h-full bg-[#00000014]">
          <h1 className="font-[700] text-[25px] md:text-[40px] text-[#FFFFFF] ">
            Login Page
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full px-[20px]"
          >
            <div className="flex flex-col justify-center gap-[20px]">
              <div className="flex justify-center">
                <input
                  aria-label="E-mail"
                  {...register("Email", {
                    required: "This field is required",
                  })}
                  placeholder="E-mail"
                  className="rounded-[10px] h-[68px] w-full md:w-[443px] border-[2px] border-[#B1AEC2] bg-transparent font-[500] text-[15px] px-2"
                />
                {errors.Email && (
                  <p className="text-red-500 text-sm">{errors.Email.message}</p>
                )}
              </div>
              <div className="flex justify-center">
                <input
                  type="password"
                  aria-label="Password"
                  {...register("Password", {
                    required: "This field is required",
                  })}
                  placeholder="Password"
                  className="rounded-[10px] h-[68px] w-[443px] border-[2px] border-[#B1AEC2] bg-transparent font-[500] text-[15px] px-2"
                />
                {errors.Password && (
                  <p className="text-red-500 text-sm">
                    {errors.Password.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-center pt-[65px]">
              <button
                type="submit"
                className="bg-[#65E8BF] text-[#291F6F] font-[500] text-[20px] rounded-[20px] h-[50px] md:h-[85.31px] w-[444px]"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
