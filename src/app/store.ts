import { configureStore } from "@reduxjs/toolkit";
import { faqReducer } from "./features/faqSlice";
import { peopleTableReducer } from "./features/peopleTableSlice";
import authReducer from "./features/authSlice";
import { federalReducer } from "./features/federalSlice";
import { teamTableReducer } from "./features/teamTableSlice";
// import { SpeakersReducer } from "./features/speakerSlice";

export const store = configureStore({
  reducer: {
    faqReducer,
    auth: authReducer,
    peopleTable: peopleTableReducer,
    federal: federalReducer,
    teamTable:teamTableReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
