import React from "react";
import AdminLoginForm from "./_components/AdminLoginForm";
import Image from "next/image";
import { Metadata } from "next";
import Logo from "@/components/common/Logo";

export const metadata: Metadata = {
  title: "Admin Login | AdoSupport",
  description: "Administrator access portal",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Illustration & Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-8 text-white">
        <div>
          <Logo size="lg" />
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center flex-1 py-8">
          <div className="relative w-full max-w-lg h-80">
            <Image
              src="/assets/images/login-image.svg"
              alt="Admin portal illustration"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div className="mt-8 text-center max-w-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Administration Portal
            </h2>
            <p className="text-muted-foreground">
              Secure access for authorized personnel only. This portal contains
              sensitive information and administrative controls.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} AdoSupport. All rights reserved.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white">
        <div className="lg:hidden p-6">
          <Logo size="md" />
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <AdminLoginForm />
          </div>
        </div>

        <div className="lg:hidden p-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AdoSupport. All rights reserved.
        </div>
      </div>
    </div>
  );
}
