"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import { ElementType } from "react";

interface SidebarLinkProps {
  item: {
    title: string;
    href: string;
    icon: string;
    badge?: string;
    badgeColor?: string;
  };
  collapsed: boolean;
}

export default function SidebarLink({ item, collapsed }: SidebarLinkProps) {
  const pathname = usePathname();

  const isActive = (() => {
    // Exact match for the current path
    if (pathname === item.href) {
      return true;
    }

    if (item.href !== "/admin/users" && pathname.startsWith(`${item.href}/`)) {
      return true;
    }

    // Special case for overview pages - only active if exact match
    if (item.href === "/admin/users" && pathname === "/admin/users") {
      return true;
    }

    return false;
  })();

  const IconComponent = (Icons[item.icon as keyof typeof Icons] ||
    Icons.Circle) as ElementType;

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-gray-700 hover:bg-gray-100"
      )}
      title={collapsed ? item.title : undefined}
    >
      <IconComponent
        className={cn(
          "h-5 w-5 shrink-0",
          isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-700"
        )}
      />

      {!collapsed && <span className="flex-1 truncate">{item.title}</span>}

      {!collapsed && item.badge && (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium",
            item.badgeColor || "bg-gray-100 text-gray-700"
          )}
        >
          {item.badge}
        </span>
      )}

      {/* Show smaller badges when collapsed */}
      {collapsed && item.badge && (
        <span
          className={cn(
            "absolute right-1 top-1 h-2 w-2 rounded-full",
            item.badgeColor
              ? item.badgeColor.replace("text-", "bg-").split(" ")[1]
              : "bg-gray-700"
          )}
        />
      )}
    </Link>
  );
}
