"use client";

import { useState, useEffect } from "react";
import StoreHeader from "./_components/StoreHeader";
import { Separator } from "@/components/ui/separator";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <StoreHeader />
      <Separator />
      <main className="flex-1">{children}</main>
    </div>
  );
}
