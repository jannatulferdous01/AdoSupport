"use client";

import React from "react";
import Navbar from "@/components/common/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-6">{children}</main>
      <footer className="py-4 border-t bg-muted/20">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AdoSupport. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
