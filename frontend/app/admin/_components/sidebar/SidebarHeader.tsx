import React from "react";
import Link from "next/link";
import Logo from "@/components/common/Logo";

interface SidebarHeaderProps {
  collapsed: boolean;
}

export default function SidebarHeader({ collapsed }: SidebarHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
      <Link href="/admin" className="flex items-center gap-2">
        {collapsed ? (
          <Logo size="sm" showText={false} />
        ) : (
          <>
            <Logo size="sm" showText={false} />
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold text-gray-900">
                AdoSupport
              </span>
              <span className="text-xs text-gray-500">Admin Portal</span>
            </div>
          </>
        )}
      </Link>
    </div>
  );
}
