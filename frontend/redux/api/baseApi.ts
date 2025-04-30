import { createApi } from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "@/redux/tag-types";
import axiosBaseQuery from "@/helpers/axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL as string,
  }),
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});

export default baseApi;
