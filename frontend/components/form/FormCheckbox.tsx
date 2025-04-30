import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormCheckboxProps {
  name: string;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

const FormCheckbox = ({
  name,
  label,
  description,
  disabled = false,
  className = "",
  required = false,
}: FormCheckboxProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("flex items-start space-x-2", className)}>
          <Checkbox
            id={name}
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
            className="mt-1"
          />

          <div className="space-y-1">
            <Label
              htmlFor={name}
              className="text-xs font-medium text-gray-700 cursor-pointer"
            >
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>

            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}

            {error && <p className="text-xs text-red-500">{error.message}</p>}
          </div>
        </div>
      )}
    />
  );
};

export default FormCheckbox;
