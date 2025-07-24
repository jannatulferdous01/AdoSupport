"use server";

import { FieldValues } from "react-hook-form";

export const registerUser = async (data: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register/`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    return await res.json();
  } catch (error: any) {
    console.error("Error during registration:", error?.message || error);
    return {
      success: false,
      message: "An error occurred during registration. Please try again later.",
    };
  }
};
