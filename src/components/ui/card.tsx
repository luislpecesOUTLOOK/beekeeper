import * as React from "react";
import { cn } from "./button";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  padded?: boolean;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padded = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-cream/10 bg-card text-cream shadow-sm",
        padded && "p-6",
        className,
      )}
      {...props}
    />
  ),
);

Card.displayName = "Card";

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-2 pb-2", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-extrabold tracking-tight text-cream", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("pt-2", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
