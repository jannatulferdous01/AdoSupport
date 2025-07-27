import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  };
}

export default function AdminPageHeader({
  title,
  description,
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>

      {action && (
        <Button onClick={action.onClick} className="shrink-0">
          {action.icon}
          {action.label}
        </Button>
      )}
    </div>
  );
}