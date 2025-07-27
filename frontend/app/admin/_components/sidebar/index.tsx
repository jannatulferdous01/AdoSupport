"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import SidebarHeader from "./SidebarHeader";
import SidebarSection from "./SidebarSection";

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function AdminSidebar({
  collapsed,
  setCollapsed,
}: AdminSidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <SidebarHeader collapsed={collapsed} />

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none hover:scrollbar-thin hover:scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
        <div className="mt-6 flex flex-col gap-2 px-2 pb-6">
          <SidebarSection
            title="Overview"
            collapsed={collapsed}
            items={[
              {
                title: "Dashboard",
                href: "/admin",
                icon: "LayoutDashboard",
                badge: "",
              },
              {
                title: "Analytics",
                href: "/admin/analytics",
                icon: "BarChart3",
                badge: "",
              },
              {
                title: "Activity Log",
                href: "/admin/activity",
                icon: "Activity",
                badge: "3",
              },
            ]}
          />

          <SidebarSection
            title="User Management"
            collapsed={collapsed}
            items={[
              {
                title: "Overview",
                href: "/admin/users",
                icon: "LayoutDashboard",
                badge: "",
              },
              {
                title: "Adolescents",
                href: "/admin/users/adolescents",
                icon: "Users",
                badge: "",
              },
              {
                title: "Parents",
                href: "/admin/users/parents",
                icon: "UserCircle",
                badge: "",
              },
              {
                title: "Experts",
                href: "/admin/users/experts",
                icon: "UserCog",
                badge: "New",
                badgeColor: "bg-blue-100 text-blue-700",
              },
            ]}
          />

          <SidebarSection
            title="Community"
            collapsed={collapsed}
            items={[
              {
                title: "Overview",
                href: "/admin/content/",
                icon: "LayoutDashboard",
                badge: "",
                badgeColor: "bg-orange-100 text-orange-700",
              },
              {
                title: "Posts",
                href: "/admin/content/posts",
                icon: "FileText",
                badge: "",
              },
              {
                title: "Reports",
                href: "/admin/content/reports",
                icon: "Flag",
                badge: "",
              },
            ]}
          />

          <SidebarSection
            title="Store"
            collapsed={collapsed}
            items={[
              {
                title: "Overview",
                href: "/admin/store/",
                icon: "LayoutDashboard",
                badge: "",
                badgeColor: "bg-orange-100 text-orange-700",
              },
              {
                title: "Products",
                href: "/admin/store/products",
                icon: "ShoppingBag",
                badge: "",
              },
              {
                title: "Orders",
                href: "/admin/store/orders",
                icon: "ShoppingCart",
                badge: "5",
                badgeColor: "bg-green-100 text-green-700",
              },
              {
                title: "Subscriptions",
                href: "/admin/store/subscriptions",
                icon: "Repeat",
                badge: "",
              },
            ]}
          />

          <SidebarSection
            title="Settings"
            collapsed={collapsed}
            items={[
              {
                title: "General",
                href: "/admin/settings/general",
                icon: "Settings",
                badge: "",
              },
              {
                title: "Administrators",
                href: "/admin/settings/administrators",
                icon: "ShieldCheck",
                badge: "",
                superadminOnly: true,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-3 z-50 lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Mobile sidebar (Sheet component) */}
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="w-64 p-0 pt-10">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      ) : (
        /* Desktop sidebar */
        <aside
          className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          {sidebarContent}

          {/* Collapse button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-20 hidden h-6 w-6 rounded-full border border-gray-200 bg-white shadow-sm lg:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            )}
          </Button>
        </aside>
      )}
    </>
  );
}
