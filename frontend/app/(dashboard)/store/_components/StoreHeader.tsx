"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StoreHeaderProps {
  cartCount?: number;
}

export default function StoreHeader({ cartCount = 0 }: StoreHeaderProps) {
  const pathname = usePathname();

  const storeCategories = [
    { name: "Categories", href: "/store/categories" },
    { name: "Products", href: "/store/products" },
    { name: "New", href: "/store/new" },
    { name: "Deals", href: "/store/deals" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      {/* Main header content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Store logo/title */}
          <Link href="/store" className="font-medium text-primary text-lg">
            Store
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            <Link href="/store/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/store/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto py-2 flex space-x-4 sm:space-x-6 no-scrollbar">
            <Link
              href="/store"
              className={cn(
                "text-sm whitespace-nowrap font-medium transition-colors",
                pathname === "/dashboard/store"
                  ? "text-primary"
                  : "text-gray-700 hover:text-primary"
              )}
            >
              Home
            </Link>
            {storeCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={cn(
                  "text-sm whitespace-nowrap font-medium transition-colors",
                  pathname === category.href
                    ? "text-primary"
                    : "text-gray-700 hover:text-primary"
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
