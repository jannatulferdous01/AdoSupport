"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/redux/hook";
import SidebarLink from "./SidebarLink";

interface SidebarItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
  superadminOnly?: boolean;
}

interface SidebarSectionProps {
  title: string;
  collapsed: boolean;
  items: SidebarItem[];
}

export default function SidebarSection({
  title,
  collapsed,
  items,
}: SidebarSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  // const { user } = useAppSelector((state) => state.auth);
  // const isSuperAdmin = user?.role === "superadmin";
  const isSuperAdmin = true;

  // Filter items based on user role
  const filteredItems = items.filter(
    (item) => !item.superadminOnly || isSuperAdmin
  );

  // If no items to show after filtering, don't render section
  if (filteredItems.length === 0) return null;

  return (
    <div className="mb-2">
      {!collapsed && (
        <button
          className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium uppercase tracking-wider text-gray-500"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>{title}</span>
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
      )}

      {collapsed && (
        <div className="mx-2 mb-2 border-b border-gray-100 pb-2 pt-1"></div>
      )}

      <div className={`${isExpanded || collapsed ? "block" : "hidden"} mt-1`}>
        {filteredItems.map((item) => (
          <SidebarLink key={item.href} item={item} collapsed={collapsed} />
        ))}
      </div>
    </div>
  );
}
