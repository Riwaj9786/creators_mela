import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_URL;

// Define Types
// export type ProvinceType = {
//   id: number;
//   name: string;
//   code: string;
// };

// export type FederalStateType = {
//   municipality: any[];
//   district: any[];
//   provience: ProvienceType[];
//   status: {
//     municipality: string;
//     district: string;
//     provience: string;
//   };
//   error: {
//     municipality: string;
//     district: string;
//     provience: string;
//   };
// };

const initialState = {
  municipality: [],
  district: [],
  province: [],
  status: {
    municipality: "idle",
    district: "idle",
    province: "idle",
  },
  error: {
    municipality: "",
    district: "",
    province: "",
  },
};

export const fetchMunicipality = createAsyncThunk(
  "federal/municipality",
  async (_, thunkAPI) => {
    // console.log("first")
    try {
      const response = await axios.get(`${BASE_URL}/federal/municipality/`);
      // console.log(response, "response");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching municipalities"
      );
    }
  }
);

export const fetchDistrict = createAsyncThunk(
  "federal/district",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/federal/district/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching districts"
      );
    }
  }
);

export const fetchProvince = createAsyncThunk(
  "federal/province",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/federal/province/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching provinces"
      );
    }
  }
);

// Slice
const federalSlice = createSlice({
  name: "federal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Municipality
    builder
      .addCase(fetchMunicipality.pending, (state) => {
        state.status.municipality = "loading";
        state.error.municipality = "";
      })
      .addCase(fetchMunicipality.fulfilled, (state, action) => {
        state.status.municipality = "success";
        state.municipality = action.payload;
      })
      .addCase(fetchMunicipality.rejected, (state, action) => {
        state.status.municipality = "failed";
        state.error.municipality = action.payload as string;
      });

    // District
    builder
      .addCase(fetchDistrict.pending, (state) => {
        state.status.district = "loading";
        state.error.district = "";
      })
      .addCase(fetchDistrict.fulfilled, (state, action) => {
        state.status.district = "success";
        state.district = action.payload;
      })
      .addCase(fetchDistrict.rejected, (state, action) => {
        state.status.district = "failed";
        state.error.district = action.payload as string;
      });

    // Province
    builder
      .addCase(fetchProvince.pending, (state) => {
        state.status.province = "loading";
        state.error.province = "";
      })
      .addCase(fetchProvince.fulfilled, (state, action) => {
        state.status.province = "success";
        state.province = action.payload;
      })
      .addCase(fetchProvince.rejected, (state, action) => {
        state.status.province = "failed";
        state.error.province = action.payload as string;
      });
  },
});

export const federalReducer = federalSlice.reducer;
export const federalSelector = (state: RootState) => state.federal;
