import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductBreadcrumbsProps {
  category: string;
  name: string;
}

export default function ProductBreadcrumbs({
  category,
  name,
}: ProductBreadcrumbsProps) {
  return (
    <nav className="w-full mb-4 sm:mb-6 overflow-hidden">
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <Link
            href="/dashboard/store"
            className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm flex items-center"
          >
            <span>Store</span>
          </Link>
        </li>

        <ChevronRight
          size={12}
          className="mx-1 sm:mx-2 text-gray-400 flex-shrink-0"
        />

        <li className="flex items-center">
          <Link
            href="/dashboard/store/categories"
            className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm max-w-[80px] sm:max-w-full truncate"
          >
            {category}
          </Link>
        </li>

        <ChevronRight
          size={12}
          className="mx-1 sm:mx-2 text-gray-400 flex-shrink-0"
        />

        <li
          className={cn(
            "text-gray-900 font-medium text-xs sm:text-sm",
            "truncate max-w-[150px] sm:max-w-[250px] md:max-w-[350px] lg:max-w-md"
          )}
          title={name}
        >
          {name}
        </li>
      </ol>
    </nav>
  );
}
