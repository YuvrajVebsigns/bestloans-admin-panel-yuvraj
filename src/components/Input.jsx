import React from "react";

export const Input = ({ label, type = "text", placeholder, className, ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-gray-700 font-medium mb-1">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        {...props}
      />
    </div>
  );
};
