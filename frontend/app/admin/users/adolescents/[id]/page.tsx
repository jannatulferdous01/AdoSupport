"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Hash,
} from "lucide-react";
import AdminCard from "../../../_components/ui/AdminCard";
import AdminPageHeader from "../../../_components/ui/AdminPageHeader";
import { mockApi } from "../_services/mockApi";
import { AdolescentUser } from "../page";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdolescentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [adolescent, setAdolescent] = useState<AdolescentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const adolescentId = params.id as string;

  useEffect(() => {
    const fetchAdolescent = async () => {
      setLoading(true);
      try {
        const userData = await mockApi.fetchUserById(adolescentId);
        setAdolescent(userData);
      } catch (error) {
        console.error("Error fetching adolescent:", error);
      } finally {
        setLoading(false);
      }
    };

    if (adolescentId) {
      fetchAdolescent();
    }
  }, [adolescentId]);

  const getStatusBadge = (status: AdolescentUser["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
    }
  };

  const handleStatusChange = async (newStatus: AdolescentUser["status"]) => {
    if (!adolescent) return;

    setActionLoading(true);
    try {
      const updatedUser = await mockApi.updateUserStatus(
        adolescent.id,
        newStatus
      );
      setAdolescent(updatedUser);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!adolescent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Adolescent not found
        </h2>
        <p className="text-gray-600 mb-4">
          The adolescent you're looking for doesn't exist.
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div>
            <AdminPageHeader
              title={adolescent.name}
              description={`User ID: ${adolescent.id}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge(adolescent.status)}

          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>

          {adolescent.status === "active" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("suspended")}
              disabled={actionLoading}
            >
              <Ban className="h-4 w-4 mr-2" />
              Suspend
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("active")}
              disabled={actionLoading}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Activate
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <AdminCard>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{adolescent.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-medium">{adolescent.age} years old</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{adolescent.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Total Posts</p>
                  <p className="font-medium">
                    {adolescent.totalPosts.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AdminCard>

        {/* Account Information */}
        <AdminCard>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Account Information
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <div className="mt-1">{getStatusBadge(adolescent.status)}</div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Join Date</p>
                <p className="font-medium">
                  {adolescent.joinDate.toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Last Active</p>
                <p className="font-medium">
                  {adolescent.lastActive.toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Warnings</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium ${
                      adolescent.warningsCount > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {adolescent.warningsCount}
                  </span>
                  {adolescent.warningsCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {adolescent.warningsCount === 1
                        ? "1 Warning"
                        : `${adolescent.warningsCount} Warnings`}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AdminCard>

        {/* Emergency Contact */}
        <AdminCard>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Emergency Contact
            </h3>

            <div className="space-y-4">
              {adolescent.parentEmail ? (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">
                      Parent/Guardian Email
                    </p>
                    <p className="font-medium">{adolescent.parentEmail}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>No emergency contact information available</p>
                </div>
              )}
            </div>
          </div>
        </AdminCard>

        {/* User Avatar */}
        <AdminCard>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Profile</h3>

            <div className="flex items-center gap-4">
              <img
                src={adolescent.avatar}
                alt={`${adolescent.name}'s avatar`}
                className="w-16 h-16 rounded-full border-2 border-gray-200"
              />
              <div>
                <p className="font-medium text-gray-900">{adolescent.name}</p>
                <p className="text-sm text-gray-600">
                  Member since {adolescent.joinDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
