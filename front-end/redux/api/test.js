import { getavgSpeedAndAccuracy } from "../../../back-end/controllers/testController";
import { apiSlice } from "../apiSlice";
import { TEST_URL } from "../constants";
export const testApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addTest: builder.mutation({
      query: (data) => ({
        url: `${TEST_URL}/addTest`,
        body: data,
        method: "POST",
      }),
    }),
    getTest: builder.query({
      query: (testId) => ({
        url: `${TEST_URL}/getTest?testId=${testId}`,
        method: "GET",
      }),
    }),
    getRecentTest: builder.mutation({
      query: ({ count, duration, difficulty, userId }) => ({
        url: `${TEST_URL}/getRecentTests`,
        method: "POST",
        body: { count, duration, difficulty, userId },
      }),
    }),
    getTopTest: builder.query({
      query: () => ({
        url: `${TEST_URL}/getTopTests`,
        method: "GET",
      }),
    }),
    getMostAccurateTest: builder.query({
      query: () => ({
        url: `${TEST_URL}/getMostAccurateTests`,
        method: "GET",
      }),
    }),
    getavgSpeedAndAccuracy: builder.mutation({
      query: ({ duration, userId, difficulty }) => ({
        url: `${TEST_URL}/getAvgSpeedAndAccuracy`,
        method: "POST",
        body: { duration, userId, difficulty },
      }),
    }),
    getTotalTests: builder.mutation({
      query: ({ duration, userId }) => ({
        url: `${TEST_URL}/getTotalTests`,
        method: "POST",
        body: { duration, userId },
      }),
    }),
  }),
});

export const {
  useAddTestMutation,
  useGetTestQuery,
  useGetTopTestQuery,
  useGetRecentTestMutation,
  useGetMostAccurateTestQuery,
  useGetavgSpeedAndAccuracyMutation,
  useGetTotalTestsMutation,
} = testApiSlice;
