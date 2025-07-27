"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Shield,
  Trash,
  Mail,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { mockApi } from "../../_services/mockApi";

interface UserActionsProps {
  user: {
    id: string;
    name: string;
    email: string;
    status: "active" | "suspended" | "pending";
  };
}

export default function UserActions({ user }: UserActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // View user profile
  const handleViewProfile = () => {
    router.push(`/admin/users/adolescents/${user.id}`);
  };

  // Edit user
  const handleEditUser = () => {
    // TODO: Implement edit user functionality
    toast.success("Edit user functionality will be implemented soon");
  };

  // Suspend/Activate user
  const handleToggleUserStatus = async () => {
    setIsLoading(true);

    // RTK Query version
    /*
    try {
      const newStatus = user.status === "suspended" ? "active" : "suspended";
      
      await updateUserStatus({
        userId: user.id,
        status: newStatus
      }).unwrap();
      
      const actionWord = newStatus === "suspended" ? "suspended" : "activated";
      toast.success(`${user.name} has been ${actionWord} successfully`);
    } catch (error) {
      toast.error("Failed to update user status");
    } finally {
      setIsLoading(false);
    }
    */

    // Mock version (remove when implementing RTK Query)
    try {
      const newStatus = user.status === "suspended" ? "active" : "suspended";
      await mockApi.updateUserStatus(user.id, newStatus);

      const actionWord = newStatus === "suspended" ? "suspended" : "activated";
      toast.success(`${user.name} has been ${actionWord} successfully`);

      // Force page refresh to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Toggle user status error:", error);
      toast.error("Failed to update user status");
    } finally {
      setIsLoading(false);
    }
  };

  // Send message to user
  const handleSendMessage = () => {
    // TODO: Implement messaging functionality
    toast.success("Messaging functionality will be implemented soon");
  };

  // Delete user (dangerous action)
  const handleDeleteUser = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}? This action cannot be undone.`
    );

    if (confirmed) {
      // TODO: Implement delete functionality
      toast.error(
        "Delete functionality requires additional security confirmation"
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>User Actions</DropdownMenuLabel>

        <DropdownMenuItem onClick={handleViewProfile}>
          <Eye className="mr-2 h-4 w-4" />
          View Profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleEditUser}>
          <Edit className="mr-2 h-4 w-4" />
          Edit User
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSendMessage}>
          <Mail className="mr-2 h-4 w-4" />
          Send Message
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleToggleUserStatus} disabled={isLoading}>
          {isLoading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Shield className="mr-2 h-4 w-4" />
          )}
          {user.status === "suspended" ? "Activate User" : "Suspend User"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDeleteUser}
          className="text-red-600 focus:text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
