"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hook";
import { Loader2 } from "lucide-react";
import AdminSidebar from "./_components/sidebar";
import AdminHeader from "./_components/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  // const { user, token, status } = useAppSelector((state) => state.auth);

  const token = "dummy-token";
  const status = "active";
  const user = {
    name: "Admin User",
    role: "superadmin",
  };

  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (!token || status !== "active") {
      router.push("/admin-login");
      return;
    }

    if (!["admin", "superadmin"].includes(user?.role)) {
      router.push("/unauthorized");
      return;
    }

    setIsLoading(false);
  }, [user, token, status, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div
        className={`flex flex-col transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Header */}
        <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
