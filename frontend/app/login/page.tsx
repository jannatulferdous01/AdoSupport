import React from "react";
import LoginForm from "./_components/LoginForm";
import Image from "next/image";
import { Metadata } from "next";
import Logo from "@/components/common/Logo";

export const metadata: Metadata = {
  title: "Login | Adol",
  description: "Log in to your account to access the platform",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Illustration & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 flex-col justify-between p-8">
        <div>
          <Logo size="lg" />
        </div>

        {/* Main Illustration */}
        <div className="flex flex-col items-center justify-center flex-1 py-8">
          <div className="relative w-full max-w-lg h-80">
            <Image
              src={`/assets/images/login-image.svg`}
              alt="Login illustration"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div className="mt-8 text-center max-w-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to your safe space
            </h2>
            <p className="text-muted-foreground">
              Jump back in and explore our resources designed to support your
              unique journey. We're here to provide personalized guidance every
              step of the way.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} AdoSupport. All rights reserved.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="lg:hidden p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="font-bold text-primary-foreground">A</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Adol</h1>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>

        <div className="lg:hidden p-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Adol. All rights reserved.
        </div>
      </div>
    </div>
  );
}
