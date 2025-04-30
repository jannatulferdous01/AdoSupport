import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
  required?: boolean;
  accent?: boolean;
}

const FormSelect = ({
  name,
  label,
  placeholder = "Select an option",
  options,
  disabled = false,
  className = "",
  required = false,
  accent = false,
}: FormSelectProps) => {
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

          <Select
            disabled={disabled}
            onValueChange={field.onChange}
            value={field.value || ""}
            defaultValue={field.value}
          >
            <SelectTrigger
              id={name}
              className={cn(
                "bg-white/50 backdrop-blur-sm transition-all duration-300",
                "focus-visible:outline-none focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-1",
                error
                  ? "border-red-500 focus-visible:border-transparent"
                  : "border-input focus-visible:border-transparent",
                accent ? "border-2 border-primary" : "",
                className
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {error && (
            <p className="text-xs text-red-500 mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

export default FormSelect;
