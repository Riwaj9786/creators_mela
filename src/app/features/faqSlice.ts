import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export type FaqType = {
  id: number;
  question: string;
  answer: string;
};
type stateType = {
  faqs: FaqType[];
  status: string;
  error: string;
};
 const BASE_URL = import.meta.env.VITE_APP_URL;

export const fetchFAQs = createAsyncThunk(
  "faq/fetchFAQs",
  async (_ = undefined, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/faq/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching data"
      );
    }
  }
);
const initialState: stateType = {
  faqs: [],
  status: "idle",
  error: "",
};
const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFAQs.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchFAQs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.faqs = action.payload;
      })
      .addCase(fetchFAQs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const faqSelector = (state: RootState) => state.faqReducer;
export const faqReducer = faqSlice.reducer;
