import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "small" | "normal" | "large";
  title?: string;
  action?: ReactNode;
}

export default function AdminCard({
  children,
  className,
  padding = "normal",
  title,
  action,
}: AdminCardProps) {
  const paddingClasses = {
    none: "",
    small: "p-3",
    normal: "p-4 md:p-6",
    large: "p-6 md:p-8",
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white shadow-sm",
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 md:px-6">
          <h3 className="font-medium text-gray-900">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={paddingClasses[padding]}>{children}</div>
    </div>
  );
}