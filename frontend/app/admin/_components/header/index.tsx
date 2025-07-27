"use client";

import { useState } from "react";
import { useAppSelector } from "@/redux/hook";
import { Bell, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Breadcrumbs from "./Breadcrumbs";
import SearchBar from "./SearchBar";
import HeaderActions from "./HeaderActions";

interface AdminHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function AdminHeader({
  collapsed,
  setCollapsed,
}: AdminHeaderProps) {
  // const { user } = useAppSelector((state) => state.auth);
  const user = {
    name: "Admin User",
    role: "superadmin",
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <SearchBar />
        </div>

        <HeaderActions />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/assets/images/dummy-user.png" alt="Admin" />
                <AvatarFallback>{user?.name?.charAt(0) || "A"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-gray-500">{user?.role}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
