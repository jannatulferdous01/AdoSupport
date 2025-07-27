"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/hook";

import CustomForm from "@/components/form/CustomForm";
import FormInput from "@/components/form/FormInput";
import FormTextarea from "@/components/form/FormTextarea";
import { FieldValues } from "react-hook-form";

// Edit profile schema
const editProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  bio: z.string().optional(),
});

export default function EditProfilePage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "/assets/images/dummy-user.png"
  );
  const [fileError, setFileError] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError("");

    if (file) {
      // File validation
      if (file.size > 5 * 1024 * 1024) {
        setFileError("Image size should be less than 5MB");
        return;
      }

      if (!file.type.includes("image")) {
        setFileError("Please upload an image file");
        return;
      }

      // Create URL for preview
      const url = URL.createObjectURL(file);
      setProfileImage(url);
    }
  };

  const handleSubmit = async (data: FieldValues) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Profile updated:", data);
      toast.success("Profile updated successfully");
      router.push("/profile");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <div className="flex items-center mb-8">
        <Link href="/profile" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-lg">Profile Information</h3>
          <p className="text-sm text-gray-500">
            Update your personal information
          </p>
        </div>

        <div className="p-6">
          {/* Profile image upload */}
          <div className="mb-8 flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
                <Image
                  src={profileImage}
                  alt="Profile"
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="absolute -bottom-2 -right-2">
                <label htmlFor="profile-upload" className="cursor-pointer">
                  <div className="bg-primary rounded-full p-2 text-white shadow-md hover:bg-primary/90 transition-colors">
                    <Upload size={16} />
                  </div>
                  <input
                    type="file"
                    id="profile-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-1">Profile Photo</h4>
              <p className="text-sm text-gray-500 mb-3">
                Upload a new profile photo. JPG, PNG or GIF, max 5MB.
              </p>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" asChild>
                  <label htmlFor="profile-upload" className="cursor-pointer">
                    Upload New
                  </label>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() =>
                    setProfileImage("/assets/images/dummy-user.png")
                  }
                >
                  <X size={14} className="mr-1" />
                  Remove
                </Button>
              </div>

              {fileError && (
                <p className="text-xs text-red-500 mt-2">{fileError}</p>
              )}
            </div>
          </div>

          {/* Profile form */}
          <CustomForm
            onSubmit={handleSubmit}
            resolver={zodResolver(editProfileSchema)}
            defaultValues={{
              name: user.name || "",
              email: user.email || "",
              phone: "+1 (555) 123-4567",
              location: "New York, NY",
              bio: "I'm a student interested in mental health awareness.",
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                name="name"
                label="Full Name"
                placeholder="Your name"
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
                name="phone"
                label="Phone Number"
                placeholder="Your phone number"
                required
              />

              <FormInput
                name="location"
                label="Location"
                placeholder="City, State"
                required
              />
            </div>

            <FormTextarea
              name="bio"
              label="Bio"
              placeholder="Tell us a little about yourself"
              rows={4}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
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
