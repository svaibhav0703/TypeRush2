import { apiSlice } from "../apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    Login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    Register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    Profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/update-profile`,
        method: "PUT",
        body: data,
      }),
    }),
    GetUser: builder.query({
      query: () => ({
        url: `${USERS_URL}/auth/google/getUser`,
        method: "GET",
      }),
    }),
    LogoutUser: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    getFastestUsers: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/getFastestUsers`,
        method: "POST",
        body: data,
      }),
    }),
    getMySpeedRank: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/getMySpeedRank`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery,
  useLogoutUserMutation,
  useProfileMutation,
  useGetFastestUsersMutation,
  useGetMySpeedRankMutation,
} = userApiSlice;
