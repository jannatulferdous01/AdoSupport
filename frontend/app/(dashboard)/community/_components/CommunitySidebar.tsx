"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Home,
  Calendar,
  Users,
  Bookmark,
  MessageSquare,
  Plus,
} from "lucide-react";
import { useAppSelector } from "@/redux/hook";

interface CommunitySidebarProps {
  onCreatePost: () => void;
}

export default function CommunitySidebar({
  onCreatePost,
}: CommunitySidebarProps) {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.user);

  const navigationItems = [
    {
      name: "Timeline",
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
      name: "Expert Directory",
      href: "/community/experts",
      icon: <Users size={20} />,
      active: pathname === "/community/experts",
    },
    {
      name: "Saved Posts",
      href: "/community/saved",
      icon: <Bookmark size={20} />,
      active: pathname === "/community/saved",
    },
    {
      name: "My Activity",
      href: "/community/activity",
      icon: <MessageSquare size={20} />,
      active: pathname === "/community/activity",
    },
  ];

  return (
    <div className="space-y-6 py-4">
      {/* User Profile - Minimal */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/assets/images/dummy-user.png" alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-gray-900">
            {user.name || "User Name"}
          </p>
        </div>
      </div>

      {/* Create Post Button */}
      <Button className="w-full gap-2" onClick={onCreatePost}>
        <Plus size={18} /> Create Post
      </Button>

      {/* Navigation - Simple */}
      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 ${
                item.active
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "text-gray-600"
              }`}
            >
              {item.icon}
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
}
