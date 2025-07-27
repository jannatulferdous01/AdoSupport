"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Home,
  MessageSquare,
  Users,
  ShoppingBag,
  LifeBuoy,
  UserCircle,
  ChevronDown,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import Logo from "./Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/redux/hook";
import { removeAuth } from "@/redux/feature/auth/authSlice";
import { removeFromLocalStorage } from "@/utils/local-storage";
import removeCookie from "@/services/actions/removeCookie";

type NavItemProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: string | number;
};

const NavItem = ({ href, label, icon, active, badge }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200",
        active
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
          : "hover:bg-muted/60 text-gray-700 hover:shadow-sm"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
      {badge && (
        <Badge variant="secondary" className="ml-1">
          {badge}
        </Badge>
      )}
    </Link>
  );
};

const MobileNavItem = ({ href, label, icon, active, badge }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200 mb-1",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "hover:bg-muted/50 text-gray-700"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-md h-9 w-9",
          active ? "bg-primary/20" : "bg-muted/70"
        )}
      >
        {icon}
      </div>
      <span className="font-medium">{label}</span>
      {badge && (
        <Badge variant={active ? "default" : "secondary"} className="ml-auto">
          {badge}
        </Badge>
      )}
    </Link>
  );
};

const Navbar = ({ userType = "adolescent" }) => {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoggedIn = true;

  const notificationCount = 3;

  const handleLogout = async () => {
    const res = await removeCookie();
    if (res.success) {
      dispatch(removeAuth());
      removeFromLocalStorage(process.env.NEXT_PUBLIC_AUTH_KEY as string);
      router.push("/login");
    }
  };

  // Function to check if a nav item should be active
  const isRouteActive = (path: string) => {
    // For exact matches
    if (pathname === path) return true;
    if (path !== "/" && pathname.startsWith(path)) return true;

    return false;
  };

  const navItems =
    userType === "adolescent"
      ? [
          {
            href: "/adolescent/home",
            label: "Home",
            icon: <Home className="h-[18px] w-[18px]" />,
          },
          {
            href: "/chatbot",
            label: "Chatbot",
            icon: <MessageSquare className="h-[18px] w-[18px]" />,
          },
          {
            href: "/community",
            label: "Community",
            icon: <Users className="h-[18px] w-[18px]" />,
            badge: 2,
          },
          {
            href: "/store",
            label: "Store",
            icon: <ShoppingBag className="h-[18px] w-[18px]" />,
          },
        ]
      : [
          {
            href: "/parent/home",
            label: "Home",
            icon: <Home className="h-[18px] w-[18px]" />,
          },
          {
            href: "/monitoring",
            label: "Monitoring",
            icon: <Users className="h-[18px] w-[18px]" />,
            badge: 2,
          },
        ];

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-all duration-200",
        scrolled
          ? "bg-white/90 backdrop-blur-lg shadow-sm border-gray-200/70"
          : "bg-white/80 backdrop-blur-md border-gray-200/50"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1.5">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isRouteActive(item.href)}
              badge={item.badge}
            />
          ))}
        </div>

        {/* Right side - Authentication/Profile */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          {isLoggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-muted/60 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/80 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 p-0 rounded-xl shadow-lg border-gray-200"
              >
                <div className="flex items-center justify-between p-3 border-b">
                  <p className="font-semibold text-gray-800">Notifications</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-medium hover:bg-muted/60"
                  >
                    Mark all read
                  </Button>
                </div>
                <div className="py-2 max-h-[350px] overflow-y-auto">
                  {notificationCount > 0 ? (
                    Array(notificationCount)
                      .fill(0)
                      .map((_, i) => (
                        <DropdownMenuItem
                          key={i}
                          className="p-3 focus:bg-muted/50 rounded-md mx-1 mb-1 cursor-pointer"
                        >
                          <div className="flex gap-3 items-start w-full">
                            <div className="rounded-full bg-primary/10 p-2 flex-shrink-0">
                              <LifeBuoy className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                New resource available
                              </p>
                              <p className="text-sm text-muted-foreground">
                                A new self-help guide has been published for
                                you.
                              </p>
                              <p className="text-xs text-muted-foreground mt-1.5">
                                2 hours ago
                              </p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))
                  ) : (
                    <div className="py-10 text-center text-muted-foreground">
                      <div className="flex justify-center mb-3">
                        <div className="rounded-full bg-muted/50 p-3">
                          <Bell className="h-5 w-5 text-muted-foreground/60" />
                        </div>
                      </div>
                      <p>No new notifications</p>
                    </div>
                  )}
                </div>
                <div className="p-2 border-t bg-muted/5">
                  <Link
                    href="/notifications"
                    className="block text-center py-2 text-sm text-primary hover:underline font-medium"
                  >
                    View all notifications
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* User menu or auth buttons */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 pl-2 pr-3 hover:bg-muted/60"
                >
                  <Avatar className="h-8 w-8 border border-muted">
                    <AvatarImage src="/assets/images/avatar.png" />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                      US
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="hidden sm:inline text-sm font-medium">
                      User
                    </span>
                    <span className="hidden sm:inline text-xs text-muted-foreground">
                      Student
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 p-1.5 rounded-xl"
              >
                <div className="p-2 mb-1.5 border-b">
                  <p className="text-sm font-medium">username@email.com</p>
                  <p className="text-xs text-muted-foreground">
                    Student Account
                  </p>
                </div>

                <DropdownMenuItem
                  asChild
                  className="py-2.5 rounded-md cursor-pointer"
                >
                  <Link href="/profile">
                    <div className="flex items-center">
                      <UserCircle className="mr-2.5 h-[18px] w-[18px]" />
                      <span>My Profile</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5 rounded-md cursor-pointer">
                  <LifeBuoy className="mr-2.5 h-[18px] w-[18px]" />
                  <span>Get Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5 rounded-md cursor-pointer">
                  <Settings className="mr-2.5 h-[18px] w-[18px]" />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1.5" />

                <DropdownMenuItem
                  className="py-2.5 text-destructive focus:text-destructive rounded-md cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2.5 h-[18px] w-[18px]" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="hover:bg-muted/60" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button className="shadow-sm" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-muted/60"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85%] sm:w-[380px] pr-0 border-l-gray-200"
            >
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <Logo />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSheetOpen(false)}
                  className="h-8 w-8 p-0 rounded-full hover:bg-muted/60"
                >
                  <span className="sr-only">Close</span>
                  <Menu className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-8 px-2 space-y-1">
                {navItems.map((item) => (
                  <MobileNavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={isRouteActive(item.href)}
                    badge={item.badge}
                  />
                ))}
              </div>

              <div className="absolute bottom-8 left-4 right-4 border-t pt-4">
                <div className="flex items-center mb-4 px-2">
                  <Avatar className="h-10 w-10 border border-muted">
                    <AvatarImage src="/assets/images/avatar.png" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      US
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="font-medium text-sm">User Name</p>
                    <p className="text-xs text-muted-foreground">
                      username@email.com
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full border-gray-200"
                    onClick={() => setSheetOpen(false)}
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSheetOpen(false);
                      // Add logout logic here
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
