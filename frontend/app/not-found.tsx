"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hook";

export default function NotFound() {
  const router = useRouter();

  const { id, role } = useAppSelector((state) => state.user);
  const isAuthenticated = Boolean(id);

  const homeRoute = !isAuthenticated
    ? "/"
    : role === "adolescent"
    ? "/adolescent/home"
    : role === "parent"
    ? "/parent/home"
    : "/";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-10 bg-white">
      {/* Simple background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl text-center space-y-10 md:space-y-12">
        {/* 404 Header */}
        <h1 className="text-9xl md:text-[10rem] lg:text-[12rem] font-bold text-primary/10 tracking-tighter">
          404
        </h1>

        {/* Content card */}
        <div className="bg-white p-8 sm:p-10 md:p-12 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
            Page Not Found
          </h2>

          <p className="text-gray-600 text-base md:text-lg mb-8 md:mb-10 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Navigation Buttons */}
          <div className="flex gap-4 md:gap-6 flex-col sm:flex-row max-w-md mx-auto">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 py-3 sm:py-4 md:py-6 text-sm sm:text-base"
              size="default"
            >
              <ArrowLeft size={16} className="mr-2 sm:mr-2 md:size-5" />
              Go Back
            </Button>

            <Button
              asChild
              className="flex-1 py-3 sm:py-4 md:py-6 text-sm sm:text-base"
            >
              <Link href={homeRoute}>
                <Home size={16} className="mr-2 sm:mr-2 md:size-5" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
