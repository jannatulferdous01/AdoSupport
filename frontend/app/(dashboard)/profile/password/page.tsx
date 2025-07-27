"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";

import CustomForm from "@/components/form/CustomForm";
import FormInput from "@/components/form/FormInput";
import { FieldValues } from "react-hook-form";

// Password change schema with validation
const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must include uppercase, lowercase, number and special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ChangePasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: FieldValues) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Password changed:", data);
      toast.success("Password changed successfully");
      router.push("/profile");
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-16">
      <div className="flex items-center mb-8">
        <Link href="/profile" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Change Password</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-lg">Update Your Password</h3>
          <p className="text-sm text-gray-500">
            Ensure your account is using a strong, secure password
          </p>
        </div>

        <div className="p-6">
          <CustomForm
            onSubmit={handleSubmit}
            resolver={zodResolver(passwordChangeSchema)}
            defaultValues={{
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            className="space-y-6"
          >
            <FormInput
              name="currentPassword"
              label="Current Password"
              type="password"
              placeholder="Enter your current password"
              required
            />

            <FormInput
              name="newPassword"
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              required
            />

            <FormInput
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your new password"
              required
            />

            <div className="bg-blue-50 rounded-lg p-4 flex gap-3 text-blue-700 text-sm">
              <ShieldCheck className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Password requirements:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-600">
                  <li>Minimum 8 characters</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one lowercase letter</li>
                  <li>At least one number</li>
                  <li>At least one special character</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/profile")}
              >
                Cancel
              </Button>
            </div>
          </CustomForm>
        </div>
      </div>
    </div>
  );
}
