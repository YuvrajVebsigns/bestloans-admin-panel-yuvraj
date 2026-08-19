// src/components/ui/Button.jsx
import React from "react";

export const Button = ({ children, className, variant = "primary", ...props }) => {
  const baseStyles = "py-3 px-6 font-semibold rounded-lg transition-all";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
