"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  MoreHorizontal,
  Eye,
  Edit,
  UserCheck,
  UserX,
  Calendar,
  Trash2,
} from "lucide-react";
import { ExpertUser } from "../../page";

interface ExpertActionsProps {
  expert: ExpertUser;
  onEdit?: (expert: ExpertUser) => void;
  onViewDetails?: (expert: ExpertUser) => void;
  onViewSessions?: (expert: ExpertUser) => void;
  onToggleStatus?: (expert: ExpertUser) => void;
  onDelete?: (expert: ExpertUser) => void;
}

export default function ExpertActions({
  expert,
  onEdit,
  onViewDetails,
  onViewSessions,
  onToggleStatus,
  onDelete,
}: ExpertActionsProps) {
  const getStatusAction = () => {
    switch (expert.status) {
      case "active":
        return {
          label: "Suspend Expert",
          icon: <UserX className="h-4 w-4" />,
          className: "text-orange-600",
        };
      case "suspended":
        return {
          label: "Activate Expert",
          icon: <UserCheck className="h-4 w-4" />,
          className: "text-green-600",
        };
      case "pending":
        return {
          label: "Activate Expert",
          icon: <UserCheck className="h-4 w-4" />,
          className: "text-green-600",
        };
      default:
        return {
          label: "Toggle Status",
          icon: <UserCheck className="h-4 w-4" />,
          className: "",
        };
    }
  };

  const statusAction = getStatusAction();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => onViewDetails?.(expert)}>
          <Eye className="mr-2 h-4 w-4" />
          View Profile
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onEdit?.(expert)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Expert
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onViewSessions?.(expert)}>
          <Calendar className="mr-2 h-4 w-4" />
          View Sessions
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => onToggleStatus?.(expert)}
          className={statusAction.className}
        >
          {statusAction.icon}
          {statusAction.label}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Expert
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Expert Account</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {expert.name}'s account? This action
                cannot be undone and will permanently remove all associated data
                including session history and ratings.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete?.(expert)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}