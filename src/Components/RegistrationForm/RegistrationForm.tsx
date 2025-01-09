import { useForm } from "react-hook-form";
import InfoCircle from "../../assets/Icons/InfoCircle.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  federalSelector,
  fetchDistrict,
  fetchMunicipality,
  fetchProvince,
} from "../../app/features/federalSlice";
import { useEffect, useState } from "react";
// import { AppDispatch } from "../../app/store";

const BASE_URL = import.meta.env.VITE_APP_URL;

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMunicipality());
    dispatch(fetchDistrict());
    dispatch(fetchProvince());
  }, []);

  const { district, province, municipality } = useSelector(federalSelector);
  const [formError, setFormError] = useState<string | null>(null);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  const districtOption =
    district?.length > 0 &&
    district.filter((item) => item.province.id === Number(selectedProvince));
  console.log("district option", districtOption);

  const municipalityOption =
    municipality?.length > 0 &&
    municipality.filter(
      (item) => item.district.id === Number(selectedDistrict)
    );
  // console.log("district option", districtOption);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${BASE_URL}/accounts/profile/edit/`,
        {
          phoneNumber: data.phone,
          gender: data.gender,
          age: data.age,
          province: data.province,
          district: data.district,
          municipality: data.municipality,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      navigate("/SocialMediaRegistrationPage");
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

  // console.log("selected", selectedDistrict);

  return (
    <div>
      <h1 className="text-white font-[500] text-[24px]">
        Apply to Join the Creator's मेला
      </h1>
      <div className="bg-[#FFFFFF66] w-[460px] p-4 rounded-md">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Phone Number */}
          <label className="text-[#17113D] text-[12px] font-[400]">
            Phone Number
          </label>
          <input
            {...register("phoneNumber", {
              required: "Phone number is required",
              pattern: {
                value: /^(\+977[- ]?)?(98|97|96)\d{8}$/,
                message: "Invalid phone number format",
              },
            })}
            placeholder="Enter your Phone Number"
            className="rounded-[8px] h-[46px] w-[331px] border border-[#FFFFFF80] bg-[#FFFFFFB2] font-[400] text-[12px] px-2"
          />
          {errors.phoneNumber && (
            <span className="text-red-500 text-xs">
              {errors.phoneNumber.message}
            </span>
          )}

          {/* Gender Dropdown */}
          <label className="text-[#17113D] text-[12px] font-[400]">
            Gender
          </label>
          <select
            {...register("gender", { required: "Gender is required" })}
            className="rounded-[8px] h-[46px] w-[331px] border border-[#FFFFFF80] bg-[#FFFFFFB2] font-[400] text-[12px] px-2"
          >
            <option value="" disabled selected>
              Select your Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <span className="text-red-500 text-xs">
              {errors.gender.message}
            </span>
          )}

          {/* Age */}
          <label className="text-[#17113D] text-[12px] font-[400]">Age</label>
          <input
            {...register("age", { required: "Age is required" })}
            placeholder="Enter your Age"
            className="rounded-[8px] h-[46px] w-[331px] border border-[#FFFFFF80] bg-[#FFFFFFB2] font-[400] text-[12px] px-2"
          />
          {errors.age && (
            <span className="text-red-500 text-xs">{errors.age.message}</span>
          )}

          {/* Province Dropdown */}
          <label className="text-[#17113D] text-[12px] font-[400]">
            Province
          </label>

          <select
            {...register("province", { required: "Province is required" })}
            onChange={(e) => setSelectedProvince(e.target.value)}
            value={selectedProvince}
            className="rounded-[8px] h-[46px] w-[331px] border border-[#FFFFFF80] bg-[#FFFFFFB2] font-[400] text-[12px] px-2"
          >
            <option value="" disabled>
              Select your Province
            </option>
            {province?.length > 0 &&
              province.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
          {errors.province && (
            <span className="text-red-500 text-xs">
              {errors.province.message}
            </span>
          )}

          {/* District Dropdown */}
          <label className="text-[#17113D] text-[12px] font-[400]">
            District [Optional]
          </label>
          <select
            {...register("district")}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            value={selectedDistrict}
            className="rounded-[8px] h-[46px] w-[331px] border border-[#FFFFFF80] bg-[#FFFFFFB2] font-[400] text-[12px] px-2"
          >
            <option value="" disabled>
              Select your District
            </option>
            {districtOption?.length > 0 &&
              districtOption.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>

          {/* Municipality/Rural Municipality Dropdown */}
          <label className="text-[#17113D] text-[12px] font-[400]">
            Municipality/Rural Municipality [Optional]
          </label>
          <select
            {...register("municipality")}
            onChange={(e) => setSelectedMunicipality(e.target.value)}
            value={selectedMunicipality}
            className="rounded-[8px] h-[46px] w-[331px] border border-[#FFFFFF80] bg-[#FFFFFFB2] font-[400] text-[12px] px-2"
          >
            <option value="" disabled>
              Select your Municipality
            </option>
            {municipalityOption?.length > 0 &&
              municipalityOption.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>

          {/* How did you hear about us? */}
          <label className="text-[#17113D] text-[12px] font-[400]">
            How did you hear about us?
          </label>
          <input
            {...register("referralSource", {})}
            placeholder="Enter how you heard about us"
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
        <div className="flex items-center">
          <img src={InfoCircle} alt="" />
          <span className=" text-[#FFFFFF] text-[12px] font-[400]">
            Read about
          </span>
          <span className=" text-[#65E8BF] text-[12px] font-[400]">
            the Creator's Mela Data Policy
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
