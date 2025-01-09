import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export type SpeakersType = {
  id: number;
  gender:string;
  province_name:string;
  district_name:string;
  

};
type stateType = {
  speakers: SpeakersType[];
  status: string;
  error: string;
};
const BASE_URL = import.meta.env.VITE_APP_URL;

export const fetchSpeakers = createAsyncThunk(
  "speakers/fetchSpeakers",
  async (_ = undefined, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/speakers/`);
      // console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching data"
      );
    }
  }
);
const initialState: stateType = {
  speakers: [],
  status: "idle",
  error: "",
};
const speakersSlice = createSlice({
  name: "speakers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpeakers.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchSpeakers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.speakers = action.payload;
      })
      .addCase(fetchSpeakers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const SpeakersSelector = (state: RootState) => state.speakersReducer;
export const speakersReducer = speakersSlice.reducer;
