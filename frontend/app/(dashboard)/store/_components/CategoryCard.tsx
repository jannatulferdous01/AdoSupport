"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
  borderColor: string;
  count: number;
  href: string;
}

export default function CategoryCard({
  title,
  description,
  icon,
  color,
  textColor,
  borderColor,
  count,
  href,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative rounded-lg border p-5 flex flex-col",
        "transition-all duration-200 hover:shadow-md",
        borderColor
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={cn(
            "rounded-lg p-2 w-10 h-10 flex items-center justify-center",
            color
          )}
        >
          <div className={textColor}>{icon}</div>
        </div>
        <Badge variant="outline" className="bg-white">
          {count} items
        </Badge>
      </div>

      <div>
        <h3 className={cn("font-semibold text-lg mb-1", textColor)}>
          {title}
        </h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      <div className="mt-4 flex items-center text-sm font-medium gap-1 group-hover:gap-2 transition-all duration-200">
        <span className={textColor}>Browse products</span>
        <ArrowRight size={14} className={textColor} />
      </div>
    </Link>
  );
}