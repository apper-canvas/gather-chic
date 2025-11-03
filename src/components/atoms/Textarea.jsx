import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ className, label, error, rows = 4, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-secondary">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          "flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-all duration-200",
          "placeholder:text-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-vertical",
          error && "border-error focus:ring-error/50 focus:border-error",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;