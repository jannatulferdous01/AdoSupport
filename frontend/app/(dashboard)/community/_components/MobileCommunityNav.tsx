"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Users, Bookmark, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileCommunityNavProps {
  onCreatePost: () => void;
}

export default function MobileCommunityNav({
  onCreatePost,
}: MobileCommunityNavProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: "Home",
      href: "/community",
      icon: <Home size={20} />,
      active: pathname === "/community",
    },
    {
      name: "Live Sessions",
      href: "/community/live-sessions",
      icon: <Calendar size={20} />,
      active: pathname === "/community/live-sessions",
    },
    {
      name: "Experts",
      href: "/community/experts",
      icon: <Users size={20} />,
      active: pathname === "/community/experts",
    },
    {
      name: "Saved",
      href: "/community/saved",
      icon: <Bookmark size={20} />,
      active: pathname === "/community/saved",
    },
  ];

  return (
    <div className="flex justify-around items-center h-16">
      {navigationItems.map((item) => (
        <Link key={item.name} href={item.href} className="flex-1">
          <Button
            variant="ghost"
            size="sm"
            className={`w-full h-full flex-col gap-1 rounded-none ${
              item.active ? "text-primary" : "text-gray-600"
            }`}
          >
            {item.icon}
            <span className="text-xs">{item.name}</span>
          </Button>
        </Link>
      ))}

      <div className="flex-1">
        <Button
          onClick={onCreatePost}
          size="sm"
          className="w-full h-full flex-col gap-1 rounded-none"
        >
          <Plus size={20} />
          <span className="text-xs">Post</span>
        </Button>
      </div>
    </div>
  );
}
