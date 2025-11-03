import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, children, hover = true, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-surface rounded-xl border border-gray-100 shadow-sm",
        hover && "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;