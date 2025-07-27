import React from "react";
import Link from "next/link";
import {
  User,
  Settings,
  Lock,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const AccountMenu = ({ router }: { router: AppRouterInstance }) => {
  const menuItems = [
    {
      label: "Profile Settings",
      icon: <User size={18} />,
      href: "/profile/edit",
    },
    {
      label: "Change Password",
      icon: <Lock size={18} />,
      href: "/profile/password",
    },
    {
      label: "Notifications",
      icon: <Bell size={18} />,
      href: "/profile/notifications",
    },
    {
      label: "Privacy & Security",
      icon: <Shield size={18} />,
      href: "/profile/privacy",
    },
    {
      label: "Help & Support",
      icon: <HelpCircle size={18} />,
      href: "/help",
    },
  ];

  const handleLogout = () => {
    // Handle logout logic
    router.push("/login");
  };

  return (
    <div className="lg:w-72 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/70">
          <h2 className="font-semibold text-gray-800 text-xl">
            Account Settings
          </h2>
        </div>

        <nav className="flex flex-col">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 border-b border-gray-100 text-gray-700 hover:text-primary transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}

          <button
            className="flex items-center gap-3 p-4 text-left hover:bg-red-50 text-red-600 transition-colors"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AccountMenu;
