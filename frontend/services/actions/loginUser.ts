"use server";

import { FieldValues } from "react-hook-form";
import setCookie from "./setCookie";

export const loginUser = async (data: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await res.json();

    if (result?.success && result?.data?.refresh) {
      const cookieResult = await setCookie(result?.data?.refresh);
      if (!cookieResult?.success) {
        return {
          ...result,
          success: false,
          message: "Login successful, but failed to set cookie",
        };
      }
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong, please try again later",
    };
  }
};
