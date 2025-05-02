import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

  // Only allow password toggle when type is password
  const isPassword = type === "password";
  const effectiveType = isPassword && showPassword ? "text" : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

          <div className="relative">
            <Input
              id={name}
              type={effectiveType}
              className={cn(
                "bg-white/50 backdrop-blur-sm transition-all duration-300",
                "focus-visible:outline-none focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-1",
                error
                  ? "border-red-500 focus-visible:border-transparent"
                  : "border-input focus-visible:border-transparent",
                accent ? "border-2 border-primary" : "",
                isPassword ? "pr-10" : "",
                className
              )}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
            />

            {isPassword && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-500 mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

export default FormInput;
