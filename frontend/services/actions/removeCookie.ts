"use server";

import { cookies } from "next/headers";

type TCookieOptions = {
  path?: string;
};

const removeCookie = async (options?: TCookieOptions) => {
  try {
    cookies().delete({
      name: process.env.NEXT_PUBLIC_COOKIE_NAME as string,
      path: options?.path || "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Cookie removal error:", error);
    return { success: false, error: "Failed to remove cookie" };
  }
};

export default removeCookie;
