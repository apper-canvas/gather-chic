import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white focus:ring-primary/50 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-secondary focus:ring-gray-300 border border-gray-200",
    accent: "bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white focus:ring-accent/50 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]",
    outline: "border border-primary text-primary hover:bg-gradient-to-r hover:from-primary hover:to-primary/80 hover:text-white focus:ring-primary/50 transform hover:scale-[1.02] active:scale-[0.98]",
    ghost: "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 focus:ring-gray-300"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-sm rounded-lg",
    lg: "px-8 py-4 text-base rounded-xl"
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;