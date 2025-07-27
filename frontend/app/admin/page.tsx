"use client";

import { useAppSelector } from "@/redux/hook";
import { Users, MessageSquare, ShoppingBag, ArrowUpRight } from "lucide-react";
import AdminPageHeader from "./_components/ui/AdminPageHeader";
import AdminCard from "./_components/ui/AdminCard";

export default function AdminDashboard() {
  // const { user } = useAppSelector((state) => state.auth);
  const user = {
    name: "Admin User",
    role: "superadmin",
  };

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.name}. Here's what's happening with your platform today.`}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Quick stats cards will be added here */}
        <AdminCard className="flex items-center gap-4">
          <div className="rounded-lg bg-blue-50 p-3">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Total Users</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">1,284</span>
              <span className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                12%
              </span>
            </div>
          </div>
        </AdminCard>

        <AdminCard className="flex items-center gap-4">
          <div className="rounded-lg bg-green-50 p-3">
            <MessageSquare className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">
              Community Posts
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">328</span>
              <span className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                8%
              </span>
            </div>
          </div>
        </AdminCard>

        <AdminCard className="flex items-center gap-4">
          <div className="rounded-lg bg-purple-50 p-3">
            <ShoppingBag className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">
              Total Orders
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">$12,456</span>
              <span className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                16%
              </span>
            </div>
          </div>
        </AdminCard>

        {/* More content will be added in the next steps */}
      </div>
    </>
  );
}
