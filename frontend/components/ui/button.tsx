import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Fill variants
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        accent: "bg-accent text-accent-foreground shadow-sm hover:bg-accent/90",
        success:
          "bg-success text-success-foreground shadow-sm hover:bg-success/90",
        caution:
          "bg-caution text-caution-foreground shadow-sm hover:bg-caution/90",

        // Outline variants
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent/10 hover:text-accent",
        "outline-primary":
          "border border-primary bg-transparent text-primary shadow-sm hover:bg-primary/10",
        "outline-secondary":
          "border border-secondary bg-transparent text-secondary shadow-sm hover:bg-secondary/10",
        "outline-accent":
          "border border-accent bg-transparent text-accent shadow-sm hover:bg-accent/10",
        "outline-success":
          "border border-success bg-transparent text-success shadow-sm hover:bg-success/10",
        "outline-destructive":
          "border border-destructive bg-transparent text-destructive shadow-sm hover:bg-destructive/10",
        "outline-caution":
          "border border-caution bg-transparent text-caution shadow-sm hover:bg-caution/10",

        // Other variants
        ghost: "hover:bg-accent/10 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        subtle: "bg-primary/10 text-primary hover:bg-primary/20",
      },
      size: {
        sm: "h-8 rounded-md px-3 py-1 text-xs",
        default: "h-10 px-4 py-2",
        md: "h-11 px-6 py-2.5 text-sm",
        lg: "h-12 rounded-md px-8 py-3 text-base",
        xl: "h-14 rounded-md px-10 py-3.5 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
      fullWidth: {
        true: "w-full",
      },
      rounded: {
        true: "rounded-full",
        false: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, fullWidth, rounded, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, fullWidth, rounded, className })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
