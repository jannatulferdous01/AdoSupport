"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  name: string;
  userType?: "adolescent" | "parent" | "expert";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function UserAvatar({ 
  src, 
  name, 
  userType = "adolescent",
  size = "md", 
  className 
}: UserAvatarProps) {
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "h-6 w-6 text-xs";
      case "md":
        return "h-8 w-8 text-sm";
      case "lg":
        return "h-10 w-10 text-base";
      default:
        return "h-8 w-8 text-sm";
    }
  };

  const getUserTypeColors = (userType: string) => {
    switch (userType) {
      case "adolescent":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "parent":
        return "bg-green-50 text-green-600 border-green-100";
      case "expert":
        return "bg-purple-50 text-purple-600 border-purple-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <Avatar className={cn(getSizeClasses(size), className)}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback className={getUserTypeColors(userType)}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}