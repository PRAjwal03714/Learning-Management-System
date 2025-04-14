import React from 'react';

export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`border border-gray-300 rounded px-3 py-2 text-sm w-full ${className}`}
      {...props}
    />
  );
}
