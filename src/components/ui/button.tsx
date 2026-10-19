import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "amber";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const variants = {
      default: "bg-amber text-ink font-bold hover:brightness-110 transition-[filter]",
      amber: "bg-amber text-ink font-bold hover:brightness-110 transition-[filter]",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      outline:
        "border border-cream/30 bg-card hover:border-amber hover:text-amber",
      ghost: "hover:bg-cream/10 hover:text-amber",
    };

    const sizes = {
      default: "min-h-[52px] px-8 rounded-full text-lg",
      sm: "h-9 px-3 text-xs font-semibold min-w-[36px] rounded-full",
      lg: "h-12 px-8 text-base font-semibold min-w-[56px] rounded-full",
    };

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-full font-display transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-60",
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, cn };
