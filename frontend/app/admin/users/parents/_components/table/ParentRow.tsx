"use client";

import { formatDistanceToNow } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ParentActions from "./ParentActions";

interface ParentRowProps {
  parent: {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: "active" | "suspended" | "pending";
    joinDate: Date;
    lastActive: Date;
    location: string;
    avatar: string;
    childrenCount: number;
    totalOrders: number;
  };
  selected: boolean;
  onSelect: (checked: boolean) => void;
}

export default function ParentRow({
  parent,
  selected,
  onSelect,
}: ParentRowProps) {
  // Status badge styling for parent account status
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

  // Activity status indicator based on last active time
  const getActivityStatus = (lastActive: Date) => {
    const hoursAgo = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60);

    if (hoursAgo < 1) {
      return <span className="text-green-600 text-xs">● Online now</span>;
    } else if (hoursAgo < 24) {
      return <span className="text-yellow-600 text-xs">● Active today</span>;
    } else if (hoursAgo < 168) {
      return <span className="text-gray-600 text-xs">● This week</span>;
    } else {
      return <span className="text-gray-400 text-xs">● Inactive</span>;
    }
  };

  return (
    <TableRow className="hover:bg-gray-50">
      {/* Selection checkbox */}
      <TableCell>
        <Checkbox checked={selected} onCheckedChange={onSelect} />
      </TableCell>

      {/* Parent user information */}
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={parent.avatar} alt={parent.name} />
            <AvatarFallback>{parent.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-gray-900">
              {parent.name}
            </p>
            <p className="truncate text-sm text-gray-500">{parent.email}</p>
            <p className="truncate text-xs text-gray-400">{parent.phone}</p>
          </div>
        </div>
      </TableCell>

      {/* Children count and order information */}
      <TableCell>
        <div className="text-sm">
          <p className="text-gray-900 font-medium">
            {parent.childrenCount} {parent.childrenCount === 1 ? 'child' : 'children'}
          </p>
          {parent.totalOrders > 0 && (
            <p className="text-gray-500 text-xs">
              {parent.totalOrders} {parent.totalOrders === 1 ? 'order' : 'orders'}
            </p>
          )}
        </div>
      </TableCell>

      {/* Account status */}
      <TableCell>{getStatusBadge(parent.status)}</TableCell>

      {/* Join date */}
      <TableCell>
        <div className="text-sm">
          <p className="text-gray-900">
            {formatDistanceToNow(parent.joinDate, { addSuffix: true })}
          </p>
          <p className="text-gray-500 text-xs">
            {parent.joinDate.toLocaleDateString()}
          </p>
        </div>
      </TableCell>

      {/* Last activity */}
      <TableCell>
        <div className="flex flex-col gap-1">
          {getActivityStatus(parent.lastActive)}
          <div className="text-xs text-gray-500">
            {formatDistanceToNow(parent.lastActive, { addSuffix: true })}
          </div>
        </div>
      </TableCell>

      {/* Location */}
      <TableCell>
        <span className="text-sm text-gray-600">{parent.location}</span>
      </TableCell>

      {/* Action menu */}
      <TableCell className="text-right">
        <ParentActions parent={parent} />
      </TableCell>
    </TableRow>
  );
}
