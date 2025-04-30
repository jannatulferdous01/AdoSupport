import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  accent?: boolean;
}

const FormInput = ({
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
  className = "",
  required = false,
  accent = false,
}: FormInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-1">
          <Label
            htmlFor={name}
            className="text-xs font-medium text-gray-700 block"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>

          <Input
            id={name}
            type={type}
            className={cn(
              "bg-white/50 backdrop-blur-sm transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-1",
              error
                ? "border-red-500 focus-visible:border-transparent"
                : "border-input focus-visible:border-transparent",
              accent ? "border-2 border-primary" : "",
              className
            )}
            placeholder={placeholder}
            disabled={disabled}
            {...field}
          />

          {error && (
            <p className="text-xs text-red-500 mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

export default FormInput;
