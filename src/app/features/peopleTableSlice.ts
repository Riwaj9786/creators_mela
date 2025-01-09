import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type PeopleDataType = {
  id: number;
  name: string;
  registrationDate: string;
  socials: string | null;
  channel: string;
  phoneNumber: string;
  gender: string;
  age: number;
  address: string;
  email: string;
  pointOfInterest: string;
  approval_status: "approved" | "rejected" | "pending";
};

type stateType = {
  peopleData: PeopleDataType[];
  status: string;
  error: string;
};

const BASE_URL = import.meta.env.VITE_APP_URL;
const token = localStorage.getItem("token");
// console.log("token", token);
// console.log("API URL:", BASE_URL);
// console.log("Token:", token);

export const fetchPeopleData = createAsyncThunk(
  "peopleTable/fetchPeopleData",
  async (
    {
      limit,
      offset,
      search,
      gender,
      approveStatus,
    }: {
      limit: number;
      offset: number;
      search?: string;
      gender?: string;
      approveStatus?: string;
    },
    thunkAPI
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }

    try {
      const searchQuery = search ? `&search=${search}` : "";
      const selectGender = gender ? `&gender=${gender}` : "";
      const selectStatus = approveStatus ? `&status=${approveStatus}` : "";
      const response = await fetch(
        `${BASE_URL}/people/attendee/list/?limit=${limit}&offset=${offset}${searchQuery}${selectGender}${selectStatus}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        return thunkAPI.rejectWithValue(await response.text());
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "An error occurred");
    }
  }
);

const initialState: stateType = {
  peopleData: [],
  status: "idle",
  error: "",
};

const peopleTableSlice = createSlice({
  name: "peopleTable",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchPeopleData.pending, (state) => {
        // console.log("Fetch people data pending");
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchPeopleData.fulfilled, (state, action) => {
        // console.log("Fetch people data fulfilled", action);
        state.status = "succeeded";
        state.peopleData = action.payload;
      })
      .addCase(fetchPeopleData.rejected, (state, action) => {
        // console.error("Fetch people data rejected", action.payload);
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const peopleTableSelector = (state: RootState) => state.peopleTable;
export const peopleTableReducer = peopleTableSlice.reducer;
