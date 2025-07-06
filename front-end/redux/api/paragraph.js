import { apiSlice } from "../apiSlice";
import { TEXT_URL } from "../constants";

export const paragraphApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createText: builder.mutation({
      query: (data) => ({
        url: `${TEXT_URL}/createText`,
        method: "POST",
        body: data,
      }),
    }),
    selectText: builder.query({
      query: (difficulty) => ({
        url: `${TEXT_URL}/selectText?difficulty=${difficulty}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateTextMutation, useSelectTextQuery } = paragraphApiSlice;
