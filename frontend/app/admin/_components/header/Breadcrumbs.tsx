"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  if (!pathname || pathname === "/admin") return null;
  
  const segments = pathname.split('/').filter(Boolean);
  
  // Map segments to human-readable names
  const getBreadcrumbName = (segment: string): string => {
    const names: Record<string, string> = {
      admin: "Dashboard",
      users: "Users",
      adolescents: "Adolescents",
      parents: "Parents",
      experts: "Experts",
      content: "Content",
      community: "Community",
      resources: "Resources",
      sessions: "Live Sessions",
      store: "Store",
      products: "Products",
      orders: "Orders",
      subscriptions: "Subscriptions",
      settings: "Settings",
      analytics: "Analytics",
      activity: "Activity Log",
    };
    
    return names[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <div className="hidden flex-wrap items-center gap-1 text-sm md:flex">
      <Link
        href="/admin"
        className="flex items-center text-gray-600 hover:text-primary"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {segments.map((segment, index) => {
        const segmentPath = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        
        return (
          <div key={segment} className="flex items-center">
            <ChevronRight className="mx-1 h-4 w-4 text-gray-400" />
            
            {isLast ? (
              <span className="font-medium text-gray-900">
                {getBreadcrumbName(segment)}
              </span>
            ) : (
              <Link
                href={segmentPath}
                className="text-gray-600 hover:text-primary"
              >
                {getBreadcrumbName(segment)}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}