import React from 'react';

export function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`border border-gray-300 rounded px-3 py-2 text-sm w-full ${className}`}
      {...props}
    />
  );
}
