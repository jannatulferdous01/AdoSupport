"use client";

import { useState } from "react";
import Link from "next/link";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomForm from "@/components/form/CustomForm";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import CustomCalendar from "@/components/form/CustomCalendar";
import { FieldValues } from "react-hook-form";
import toast from "react-hot-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { registerUser } from "@/services/actions/registerUser";
import { useRouter } from "next/navigation";

// Registration validation schema
const registerFormSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username cannot exceed 50 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    dateOfBirth: z.string({
      required_error: "Date of birth is required",
    }),
    gender: z.string().min(1, "Please select your gender"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"adolescent" | "parent">(
    "adolescent"
  );
  const router = useRouter();

  const handleRegister = async (data: FieldValues) => {
    const toastId = toast.loading("Creating account...");
    setIsLoading(true);
    try {
      const res = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        role: userType,
        gender: data.gender,
        dob: data.dateOfBirth,
      });

      console.log(res);

      if (!res.success) {
        toast.error(res.message || "Registration failed. Please try again.", {
          id: toastId,
        });
        setIsLoading(false);
        return;
      }

      toast.success("Account created successfully", { id: toastId });
      router.push("/login");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Registration failed. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="text-sm text-muted-foreground">
          Fill in your details to get started with AdoSupport
        </p>
      </div>

      {/* User type selection */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-2">I am a:</h2>
        <Tabs
          defaultValue="adolescent"
          onValueChange={(value) =>
            setUserType(value as "adolescent" | "parent")
          }
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full bg-muted/30">
            <TabsTrigger
              value="adolescent"
              className="flex items-center justify-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Adolescent
            </TabsTrigger>
            <TabsTrigger
              value="parent"
              className="flex items-center justify-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <UsersIcon className="mr-2 h-4 w-4" />
              Parent
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CustomForm
        onSubmit={handleRegister}
        resolver={zodResolver(registerFormSchema)}
        defaultValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          dateOfBirth: undefined,
          sex: "",
        }}
        className="space-y-4"
      >
        <FormInput
          name="username"
          label="Username"
          placeholder="Choose a username"
          required
        />

        <FormInput
          name="email"
          label="Email Address"
          type="email"
          placeholder="Your email"
          required
        />

        <FormInput
          name="password"
          label="Password"
          type="password"
          placeholder="Create a password"
          required
        />

        <FormInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <CustomCalendar
              name="dateOfBirth"
              label="Date of Birth"
              required
              pastDatesOnly
              yearRange={100}
              showYearNavigation
              placeholder="Select birth date"
            />
          </div>
          <div>
            <FormSelect
              name="gender"
              label="Gender"
              placeholder="Select your gender"
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2 mt-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin"></div>
          ) : (
            <UserPlusIcon size={18} />
          )}
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </CustomForm>
    </div>
  );
}
