"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Star, DollarSign, MapPin, Clock } from "lucide-react";
import { ExpertUser } from "../../page";

interface ExpertRowProps {
  expert: ExpertUser;
  selected: boolean;
  onSelect: (checked: boolean) => void;
}

export default function ExpertRow({
  expert,
  selected,
  onSelect,
}: ExpertRowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200";
      case "suspended":
        return "bg-red-50 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-50 text-green-700 border-green-200";
      case "busy":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "offline":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatExperience = (years: number) => {
    return years === 1 ? "1 year" : `${years} years`;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <TableRow className="hover:bg-muted/30 transition-colors">
      <TableCell className="px-6 py-4">
        <Checkbox checked={selected} onCheckedChange={onSelect} />
      </TableCell>

      <TableCell className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={expert.avatar} alt={expert.name} />
            <AvatarFallback className="bg-primary-50 text-primary-600">
              {expert.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0">
            <div className="font-medium text-sm truncate">{expert.name}</div>
            <div className="text-xs text-muted-foreground truncate">
              {expert.email}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{expert.location}</span>
              </span>
              <span className="flex items-center gap-1 shrink-0">
                <DollarSign className="h-3 w-3" />${expert.hourlyRate}/hr
              </span>
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell className="px-6 py-4">
        <div className="space-y-1">
          <div className="font-medium text-sm capitalize truncate">
            {expert.specialty}
          </div>
          <div className="text-xs text-muted-foreground">
            {expert.qualifications.slice(0, 2).join(", ")}
            {expert.qualifications.length > 2 && (
              <span className="whitespace-nowrap">
                {" "}
                +{expert.qualifications.length - 2} more
              </span>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell className="px-6 py-4">
        <div className="text-sm font-medium">
          {formatExperience(expert.experience)}
        </div>
      </TableCell>

      <TableCell className="px-6 py-4">{renderStars(expert.rating)}</TableCell>

      <TableCell className="px-6 py-4">
        <div className="text-sm font-medium text-center">
          {expert.totalSessions}
        </div>
      </TableCell>

      <TableCell className="px-6 py-4">
        <Badge className={getStatusColor(expert.status)} variant="outline">
          <span className="capitalize">{expert.status}</span>
        </Badge>
      </TableCell>

      <TableCell className="px-6 py-4">
        <Badge
          className={getAvailabilityColor(expert.availability)}
          variant="outline"
        >
          <span className="capitalize">{expert.availability}</span>
        </Badge>
      </TableCell>

      <TableCell className="px-6 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Edit Expert</DropdownMenuItem>
            <DropdownMenuItem>View Sessions</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              {expert.status === "active" ? "Suspend" : "Activate"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
