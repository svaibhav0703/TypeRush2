import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice.js";
import { apiSlice } from "./apiSlice.js";
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // it is used for api state management
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
export default store;
