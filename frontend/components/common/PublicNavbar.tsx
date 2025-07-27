"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const PublicNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? "bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-200/70"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        {/* Desktop Navigation - Simple Links for Public Pages */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            href="/about"
            className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/features"
            className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="/faq"
            className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
          >
            FAQs
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button className="shadow-sm" asChild>
            <Link href="/register">Sign up</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="right">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center border-b pb-4">
                <Logo />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSheetOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>

              <nav className="flex flex-col gap-2 mt-8">
                <Link
                  href="/about"
                  onClick={() => setSheetOpen(false)}
                  className="px-4 py-3 rounded-md hover:bg-muted text-gray-700"
                >
                  About
                </Link>
                <Link
                  href="/features"
                  onClick={() => setSheetOpen(false)}
                  className="px-4 py-3 rounded-md hover:bg-muted text-gray-700"
                >
                  Features
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setSheetOpen(false)}
                  className="px-4 py-3 rounded-md hover:bg-muted text-gray-700"
                >
                  FAQs
                </Link>
              </nav>

              <div className="mt-auto border-t pt-4 space-y-2">
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default PublicNavbar;
