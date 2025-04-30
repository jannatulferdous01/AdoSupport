import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig } from "axios";
import axiosInstance from "./axiosInstance";
import { TErrorResponse } from "@/types";

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
      contentType?: string;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers, contentType }) => {
    try {
      const response = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          "Content-Type": contentType || "Application/json",
          ...headers,
        },
      });
      return {
        data: response?.data,
      };
    } catch (axiosError) {
      const error = axiosError as TErrorResponse;
      return {
        error: {
          status: error?.statusCode,
          data: {
            message: error?.message,
            errorDetails: error?.errorDetails,
          },
        },
      };
    }
  };

export default axiosBaseQuery;
