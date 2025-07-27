import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export interface RadioOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface FormRadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  disabled?: boolean;
  className?: string;
  required?: boolean;
  orientation?: "vertical" | "horizontal";
}

const FormRadioGroup = ({
  name,
  label,
  options,
  disabled = false,
  className = "",
  required = false,
  orientation = "vertical",
}: FormRadioGroupProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2">
          {label && (
            <Label
              htmlFor={name}
              className="text-xs font-medium text-gray-700 block"
            >
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}

          <RadioGroup
            disabled={disabled}
            onValueChange={field.onChange}
            value={field.value}
            className={cn(
              orientation === "vertical" ? "space-y-2" : "flex space-x-4",
              className
            )}
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${name}-${option.value}`}
                />
                <Label
                  htmlFor={`${name}-${option.value}`}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  {option.icon && option.icon}
                  <span>{option.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>

          {error && (
            <p className="text-xs text-red-500 mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

export default FormRadioGroup;
