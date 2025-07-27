"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Mail,
  Phone,
  Calendar,
  Clock,
  Star,
  DollarSign,
  Award,
  Activity,
} from "lucide-react";
import { ExpertUser } from "../../page";
import { formatDistanceToNow, format } from "date-fns";

interface ExpertDetailsModalProps {
  open: boolean;
  expert: ExpertUser | null;
  onClose: () => void;
}

export default function ExpertDetailsModal({
  open,
  expert,
  onClose,
}: ExpertDetailsModalProps) {
  if (!expert) return null;

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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-2">
          {rating.toFixed(1)} out of 5
        </span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Expert Profile Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={expert.avatar} alt={expert.name} />
              <AvatarFallback className="bg-primary-50 text-primary-600 text-xl">
                {expert.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-xl font-semibold">{expert.name}</h3>
                <p className="text-muted-foreground capitalize">
                  {expert.specialty}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  className={getStatusColor(expert.status)}
                  variant="outline"
                >
                  {expert.status}
                </Badge>
                <Badge
                  className={getAvailabilityColor(expert.availability)}
                  variant="outline"
                >
                  {expert.availability}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {expert.experience} years experience
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />${expert.hourlyRate}/hour
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h4 className="font-medium mb-3">Contact Information</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{expert.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{expert.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{expert.location}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Performance Metrics */}
          <div>
            <h4 className="font-medium mb-3">Performance Metrics</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {expert.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                {renderStars(expert.rating)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Sessions</span>
                  <span className="text-sm font-medium">
                    {expert.totalSessions}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Sessions completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Qualifications */}
          <div>
            <h4 className="font-medium mb-3">
              Qualifications & Certifications
            </h4>
            <div className="flex flex-wrap gap-2">
              {expert.qualifications.map((qual, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  <Award className="h-3 w-3" />
                  {qual}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Account Information */}
          <div>
            <h4 className="font-medium mb-3">Account Information</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <span className="text-muted-foreground">Joined: </span>
                  {format(expert.joinDate, "PPP")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <span className="text-muted-foreground">Last active: </span>
                  {formatDistanceToNow(expert.lastActive, { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
