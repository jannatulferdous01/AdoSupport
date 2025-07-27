"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HeaderActions() {
  const [notificationCount, setNotificationCount] = useState(3);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
              {notificationCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
            <div className="flex w-full items-center justify-between">
              <span className="font-medium">New user registration</span>
              <span className="text-xs text-gray-500">2m ago</span>
            </div>
            <p className="text-sm text-gray-500">
              A new parent user has registered to the platform.
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
            <div className="flex w-full items-center justify-between">
              <span className="font-medium">Order completed</span>
              <span className="text-xs text-gray-500">1h ago</span>
            </div>
            <p className="text-sm text-gray-500">
              Order #12345 has been successfully processed.
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
            <div className="flex w-full items-center justify-between">
              <span className="font-medium">Content reported</span>
              <span className="text-xs text-gray-500">3h ago</span>
            </div>
            <p className="text-sm text-gray-500">
              A community post has been flagged for review.
            </p>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center font-medium text-primary">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}