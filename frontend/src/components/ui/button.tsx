import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'default', ...props }) => {
  const baseStyles = 'font-medium py-2 px-4 rounded transition-colors duration-200';

  const variantStyles = {
    default: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-red-100 text-red-600',
    outline: 'border border-red-600 text-red-600 hover:bg-red-100',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
