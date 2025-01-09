import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export type TeamTableData = {
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
  teamData: TeamTableData[];
  status: string;
  error: string;
};

const BASE_URL = import.meta.env.VITE_APP_URL;

export const fetchTeamData = createAsyncThunk(
  "TeamTable/fetchTeamData",
  async (_ = undefined, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.get(`${BASE_URL}/people/team/list/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      return response.data;
      // console.log(response, "team data response");
    } catch (error) {
      console.error("Error fetching team data:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch team data"
      );
    }
  }
);

const initialState: stateType = {
  teamData: [],
  status: "idle",
  error: "",
};

const teamTableSlice = createSlice({
  name: "teamTable",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamData.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchTeamData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teamData = action.payload;
      })
      .addCase(fetchTeamData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const teamTableSelector = (state: RootState) => state.teamTable;
export const teamTableReducer = teamTableSlice.reducer;
