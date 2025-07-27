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
  Users,
  CreditCard,
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

interface ParentActionsProps {
  parent: {
    id: string;
    name: string;
    email: string;
    status: "active" | "suspended" | "pending";
    childrenCount: number;
  };
}

export default function ParentActions({ parent }: ParentActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Navigate to parent profile details
  const handleViewProfile = () => {
    router.push(`/admin/users/parents/${parent.id}`);
  };

  // Navigate to edit parent information
  const handleEditParent = () => {
    // TODO: Implement edit parent functionality when ready
    toast.success("Edit parent functionality will be implemented soon");
  };

  // View children managed by this parent
  const handleViewChildren = () => {
    if (parent.childrenCount === 0) {
      toast.success(`${parent.name} has no registered children yet`);
      return;
    }
    router.push(`/admin/users/parents/${parent.id}/children`);
  };

  // View billing and subscription details
  const handleViewBilling = () => {
    router.push(`/admin/users/parents/${parent.id}/billing`);
  };

  // Toggle parent account status (suspend/activate)
  const handleToggleParentStatus = async () => {
    setIsLoading(true);

    // RTK Query version (commented out for future implementation)
    /*
    try {
      const newStatus = parent.status === "suspended" ? "active" : "suspended";
      
      await updateParentStatus({
        parentId: parent.id,
        status: newStatus
      }).unwrap();
      
      const actionWord = newStatus === "suspended" ? "suspended" : "activated";
      toast.success(`${parent.name} has been ${actionWord} successfully`);
    } catch (error) {
      toast.error("Failed to update parent status");
    } finally {
      setIsLoading(false);
    }
    */

    // Mock version (remove when implementing RTK Query)
    try {
      const newStatus = parent.status === "suspended" ? "active" : "suspended";
      await mockApi.updateParentStatus(parent.id, newStatus);

      const actionWord = newStatus === "suspended" ? "suspended" : "activated";
      toast.success(`${parent.name} has been ${actionWord} successfully`);

      // Force page refresh to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Toggle parent status error:", error);
      toast.error("Failed to update parent status");
    } finally {
      setIsLoading(false);
    }
  };

  // Send message to parent user
  const handleSendMessage = () => {
    // TODO: Implement messaging functionality when ready
    toast.success("Messaging functionality will be implemented soon");
  };

  // Delete parent account (dangerous action)
  const handleDeleteParent = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${parent.name}'s account? This will also affect their ${parent.childrenCount} registered children. This action cannot be undone.`
    );

    if (confirmed) {
      // TODO: Implement delete functionality with proper security
      toast.error(
        "Delete functionality requires additional security confirmation and approval workflow"
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open parent actions menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Parent Account Actions</DropdownMenuLabel>

        <DropdownMenuItem onClick={handleViewProfile}>
          <Eye className="mr-2 h-4 w-4" />
          View Parent Profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleEditParent}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Parent Info
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleViewChildren}>
          <Users className="mr-2 h-4 w-4" />
          View Children ({parent.childrenCount})
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleViewBilling}>
          <CreditCard className="mr-2 h-4 w-4" />
          Billing & Orders
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSendMessage}>
          <Mail className="mr-2 h-4 w-4" />
          Send Message
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleToggleParentStatus}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Shield className="mr-2 h-4 w-4" />
          )}
          {parent.status === "suspended" ? "Activate Parent" : "Suspend Parent"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDeleteParent}
          className="text-red-600 focus:text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Parent Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
