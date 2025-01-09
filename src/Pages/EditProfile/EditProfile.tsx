import { useForm } from "react-hook-form";
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

const BASE_URL = import.meta.env.VITE_APP_URL;

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMunicipality());
    dispatch(fetchDistrict());
    dispatch(fetchProvince());
  }, [dispatch]);

  const { district, province, municipality } = useSelector(federalSelector);

  const [formError, setFormError] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  const districtOption = district?.filter(
    (item) => item.province.id === Number(selectedProvince)
  );

  const municipalityOption = municipality?.filter(
    (item) => item.district.id === Number(selectedDistrict)
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phoneNumber: "",
      gender: "",
      age: "",
      province: "",
      district: "",
      municipality: "",
      referralSource: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/people/about/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        console.log("response", response.data);
        const userData = response.data;
        setValue("phoneNumber", userData.phone);
        setValue("gender", userData.gender);
        setValue("age", userData.age);
        setValue("province", userData.province);
        setValue("district", userData.district);
        setValue("municipality", userData.municipality);
        setSelectedProvince(userData.province);
        setSelectedDistrict(userData.district);
        setSelectedMunicipality(userData.municipality);
        setValue("referralSource", userData.heard_from);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, [setValue]);

  // console.log(selectedDistrict);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${BASE_URL}/accounts/profile/edit/`,
        {
          phoneNumber: data.phoneNumber,
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
      navigate("/UserProfile");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setFormError(error.response.data.detail || "Update failed.");
      } else {
        setFormError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex  justify-center items-center">
      <div className="flex flex-col justify-center border p-[50px] rounded-[20px]  ">
        <h1 className="text-white font-medium text-2xl">Edit Profile</h1>
        <div className="bg-white/80 w-96 p-6 rounded-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Phone Number */}
            <label className="text-gray-700 text-sm">Phone Number</label>
            <input
              {...register("phoneNumber", {
                required: "Phone number is required",
                // pattern: {
                //   value: /^(\+977[- ]?)?(98|97|96)\d{8}$/,
                //   message: "Invalid phone number format",
                // },
              })}
              placeholder="Enter your Phone Number"
              className="rounded-lg h-12 w-full border bg-gray-100 px-3"
            />
            {errors.phoneNumber && (
              <span className="text-red-500 text-xs">
                {errors.phoneNumber.message}
              </span>
            )}

            {/* Gender Dropdown */}
            <label className="text-gray-700 text-sm">Gender</label>
            <select
              {...register("gender", { required: "Gender is required" })}
              className="rounded-lg h-12 w-full border bg-gray-100 px-3"
            >
              {/* <option value="" disabled>
                Select your Gender
              </option> */}
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
            <label className="text-gray-700 text-sm">Age</label>
            <input
              {...register("age", {
                required: "Age is required",
  
              })}
              placeholder="Enter your Age"
              className="rounded-lg h-12 w-full border bg-gray-100 px-3"
            />
            {errors.age && (
              <span className="text-red-500 text-xs">{errors.age.message}</span>
            )}

            {/* Province Dropdown */}
            <label className="text-gray-700 text-sm">Province</label>
            <select
              {...register("province")}
              onChange={(e) => setSelectedProvince(e.target.value)}
              value={selectedProvince}
              className="rounded-lg h-12 w-full border bg-gray-100 px-3"
            >
              {/* <option value=""></option> */}
              {province?.map((item) => (
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
              District 
            </label>
            <select
              {...register("district")}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              value={selectedDistrict}
              className="rounded-[8px] h-[46px] w-[331px] border border-[#FFFFFF80] bg-[#FFFFFFB2] font-[400] text-[12px] px-2"
            >
              {/* <option value={selectedDistrict}></option> */}
              {districtOption?.length > 0 &&
                districtOption.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>

            {/* Municipality/Rural Municipality Dropdown */}
            <label className="text-[#17113D] text-[12px] font-[400]">
              Municipality/Rural Municipality 
            </label>
            <select
              {...register("municipality")}
              onChange={(e) => setSelectedMunicipality(e.target.value)}
              value={selectedMunicipality}
              className="rounded-[8px] h-[46px] w-[331px] border border-[#FFFFFF80] bg-[#FFFFFFB2] font-[400] text-[12px] px-2"
            >
              {/* <option value={selectedMunicipality}></option> */}
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
              {...register("referralSource")}
              placeholder="Enter how you heard about us"
              className="rounded-[8px] h-[46px] w-[331px] border border-[#FFFFFF80] bg-[#FFFFFFB2] font-[400] text-[12px] px-2"
            />
            {errors.referralSource && (
              <span className="text-red-500 text-xs">
                {errors.referralSource.message}
              </span>
            )}
            <button
              type="submit"
              className="bg-pink-500 text-white font-bold py-2 px-4 rounded-lg mt-4"
            >
              Continue
            </button>
          </form>
          {formError && (
            <div className="text-red-500 text-xs mt-2">{formError}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
