import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth/authSlice";
import { documentReducer } from "./document/documentSlice";
import { summaryReducer } from "./summary/summarySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    document: documentReducer,
    summary: summaryReducer,
  },
});

export default store;
