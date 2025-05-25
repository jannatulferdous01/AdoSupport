"use server";

import { cookies } from "next/headers";

type TCookieOptions = {
  path?: string;
};

const convertHoursToSeconds = (timeString: string) => {
  const hours = parseInt(timeString.replace("hr", ""));
  return !isNaN(hours) ? hours * 60 * 60 : 24 * 60 * 60;
};

const setCookie = async (token: string, options?: TCookieOptions) => {
  if (!token) {
    return { success: false, error: "Token is required" };
  }

  const expiresIn = process.env.NEXT_PUBLIC_COOKIE_EXPIRES_IN || "24hr";
  const maxAgeInSeconds = convertHoursToSeconds(expiresIn);

  try {
    cookies().set({
      name: process.env.NEXT_PUBLIC_COOKIE_NAME as string,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: options?.path || "/",
      maxAge: maxAgeInSeconds,
    });

    return { success: true };
  } catch (error) {
    console.error("Cookie setting error:", error);
    return { success: false, error: "Failed to set cookie" };
  }
};

export default setCookie;
