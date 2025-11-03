import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800",
    primary: "bg-gradient-to-r from-primary/10 to-primary/20 text-primary",
    accent: "bg-gradient-to-r from-accent/10 to-accent/20 text-accent",
    success: "bg-gradient-to-r from-success/10 to-success/20 text-success",
    warning: "bg-gradient-to-r from-warning/10 to-warning/20 text-warning",
    error: "bg-gradient-to-r from-error/10 to-error/20 text-error"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;