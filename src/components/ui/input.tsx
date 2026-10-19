import * as React from "react";
import { cn } from "./button";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl bg-card px-4 py-3 text-cream placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl bg-card px-4 py-3 text-cream placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber",
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-xl bg-card px-4 py-3 text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber",
        className,
      )}
      {...props}
    />
  ),
);

Select.displayName = "Select";

export { Input, Textarea, Select };
