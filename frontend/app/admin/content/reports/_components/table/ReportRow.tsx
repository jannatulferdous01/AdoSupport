"use client";

import { formatDistanceToNow } from "date-fns";
import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ReportData } from "../../_services/mockReportsApi";
import ReportTypeBadge from "./ReportTypeBadge";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

interface ReportRowProps {
  report: ReportData;
  selected: boolean;
  onSelect: (checked: boolean) => void;
}

export default function ReportRow({
  report,
  selected,
  onSelect,
}: ReportRowProps) {
  const getContentTypeBadge = (type: "post" | "comment" | "user") => {
    const configs = {
      post: { className: "bg-blue-50 text-blue-700", label: "Post" },
      comment: { className: "bg-green-50 text-green-700", label: "Comment" },
      user: { className: "bg-purple-50 text-purple-700", label: "User" },
    };

    const config = configs[type];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-md ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  return (
    <TableRow className="hover:bg-gray-50/50">
      {/* Checkbox Column - w-12 */}
      <TableCell className="w-12">
        <Checkbox
          checked={selected}
          onCheckedChange={onSelect}
          aria-label={`Select report ${report.id}`}
        />
      </TableCell>

      {/* Report Type Column - w-[140px] */}
      <TableCell className="w-[140px]">
        <ReportTypeBadge type={report.type} />
      </TableCell>

      {/* Content Column - min-w-[300px] */}
      <TableCell className="min-w-[300px]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {getContentTypeBadge(report.reportedContent.type)}
            <span className="text-sm font-medium text-gray-900 truncate">
              {truncateText(report.reportedContent.title, 40)}
            </span>
          </div>
          <div className="text-xs text-gray-500 truncate">
            by {report.reportedContent.author.name}
          </div>
        </div>
      </TableCell>

      {/* Reporter Column - w-[180px] */}
      <TableCell className="w-[180px]">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="h-6 w-6 flex-shrink-0">
            <AvatarImage
              src={report.reporter.avatar}
              alt={report.reporter.name}
            />
            <AvatarFallback className="text-xs">
              {report.reporter.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-900 truncate">
            {report.reporter.name}
          </span>
        </div>
      </TableCell>

      {/* Priority Column - w-[100px] */}
      <TableCell className="w-[100px]">
        <PriorityBadge priority={report.priority} />
      </TableCell>

      {/* Status Column - w-[120px] */}
      <TableCell className="w-[120px]">
        <StatusBadge status={report.status} assignedTo={report.assignedTo} />
      </TableCell>

      {/* Date Column - w-[120px] */}
      <TableCell className="w-[120px]">
        <div className="text-sm text-gray-900">
          {formatDistanceToNow(report.createdAt, { addSuffix: true })}
        </div>
      </TableCell>

      {/* Actions Column - w-[60px] */}
      <TableCell className="w-[60px]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Actions</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link href={`/admin/content/reports/${report.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Start Investigation</DropdownMenuItem>
            <DropdownMenuItem>Mark Resolved</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Dismiss
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
