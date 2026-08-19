import React from "react";

export const Card = ({ children, className }) => {
  return <div className={`bg-white shadow-lg rounded-xl p-6 ${className}`}>{children}</div>;
};

export const CardHeader = ({ children }) => {
    return <div className="border-b pb-4 mb-4">{children}</div>;
  };
  

export const CardContent = ({ children }) => {
  return <div className="text-gray-700">{children}</div>;
};

// ✅ Fix: Add missing CardTitle component
export const CardTitle = ({ children }) => {
  return <h3 className="text-lg font-bold">{children}</h3>;
};
