"use client";

import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Eye, Edit, Shield, Trash } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserActions from "./UserActions";

interface UserRowProps {
  user: {
    id: string;
    name: string;
    email: string;
    age: number;
    status: "active" | "suspended" | "pending";
    joinDate: Date;
    lastActive: Date;
    location: string;
    avatar: string;
    parentEmail?: string;
    totalPosts: number;
    warningsCount: number;
  };
  selected: boolean;
  onSelect: (checked: boolean) => void;
}

export default function UserRow({ user, selected, onSelect }: UserRowProps) {
  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-50 text-green-700">Active</Badge>;
      case "suspended":
        return <Badge className="bg-red-50 text-red-700">Suspended</Badge>;
      case "pending":
        return <Badge className="bg-yellow-50 text-yellow-700">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Activity indicator
  const getActivityStatus = (lastActive: Date) => {
    const hoursAgo = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60);

    if (hoursAgo < 1) {
      return <span className="text-green-600">● Online</span>;
    } else if (hoursAgo < 24) {
      return <span className="text-yellow-600">● Today</span>;
    } else if (hoursAgo < 168) {
      return <span className="text-gray-600">● This week</span>;
    } else {
      return <span className="text-gray-400">● Inactive</span>;
    }
  };

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <Checkbox checked={selected} onCheckedChange={onSelect} />
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-gray-900">{user.name}</p>
            <p className="truncate text-sm text-gray-500">{user.email}</p>
            {user.parentEmail && (
              <p className="truncate text-xs text-gray-400">
                Parent: {user.parentEmail}
              </p>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <span className="text-sm text-gray-900">{user.age} years</span>
      </TableCell>

      <TableCell>{getStatusBadge(user.status)}</TableCell>

      <TableCell>
        <div className="text-sm">
          <p className="text-gray-900">
            {formatDistanceToNow(user.joinDate, { addSuffix: true })}
          </p>
          <p className="text-gray-500">{user.joinDate.toLocaleDateString()}</p>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          {getActivityStatus(user.lastActive)}
          <div className="text-xs text-gray-500">
            {user.totalPosts} posts
            {user.warningsCount > 0 && (
              <span className="ml-1 text-red-500">
                • {user.warningsCount} warnings
              </span>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <span className="text-sm text-gray-600">{user.location}</span>
      </TableCell>

      <TableCell className="text-right">
        <UserActions user={user} />
      </TableCell>
    </TableRow>
  );
}
