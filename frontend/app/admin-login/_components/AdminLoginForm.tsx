"use client";

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyIcon, LogInIcon, ShieldIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomForm from "@/components/form/CustomForm";
import FormInput from "@/components/form/FormInput";
import { FieldValues } from "react-hook-form";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/hook";
import { setAuth } from "@/redux/feature/auth/authSlice";
import { useRouter } from "next/navigation";

// Admin login validation schema
const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Admin passwords must be at least 8 characters"),
});

export default function AdminLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleAdminLogin = async (data: FieldValues) => {
    const toastId = toast.loading("Verifying credentials...");
    setIsLoading(true);

    try {
      // Call your admin login API endpoint
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await res.json();

      if (!res.ok || !responseData.success) {
        toast.error(responseData.message || "Authentication failed", {
          id: toastId,
        });
        return;
      }

      // Set authentication state
      dispatch(
        setAuth({
          id: responseData.data.id,
          email: responseData.data.email,
          name: responseData.data.name,
          role: responseData.data.role,
          status: "active",
          token: responseData.data.access,
        })
      );

      // Success notification
      toast.success("Login successful", { id: toastId });

      // Redirect to admin dashboard
      router.push("/admin");
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("Authentication failed. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
      <div className="space-y-2 text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldIcon className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">Admin Portal</h1>
        <p className="text-sm text-muted-foreground">
          Secure access for authorized personnel only
        </p>
      </div>

      <CustomForm
        onSubmit={handleAdminLogin}
        resolver={zodResolver(adminLoginSchema)}
        defaultValues={{
          email: "",
          password: "",
        }}
        className="space-y-5"
      >
        <FormInput
          name="email"
          label="Email Address"
          type="email"
          placeholder="admin@adosupport.com"
          required
        />

        <div className="relative">
          <FormInput
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin"></div>
          ) : (
            <KeyIcon size={18} />
          )}
          {isLoading ? "Authenticating..." : "Secure Login"}
        </Button>
      </CustomForm>

      <div className="mt-6">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Note:</span> This portal is restricted
            to authorized administrators only. If you need assistance, please
            contact the system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
