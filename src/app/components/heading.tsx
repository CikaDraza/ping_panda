import React, { ReactNode } from 'react';
import { cn } from '@/utils';

interface HeadingProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}

export default function Heading({ 
  children, 
  variant = 'h1', 
  className = '', 
  ...props 
}: HeadingProps) {
  const Tag = variant;
  
  return (
    <Tag 
      className={cn(
        "font-heading font-semibold tracking-tight text-zinc-700", 
        variant === 'h1' && "text-4xl sm:text-5xl",
        variant === 'h2' && "text-3xl sm:text-4xl",
        variant === 'h3' && "text-2xl sm:text-3xl",
        variant === 'h4' && "text-xl sm:text-2xl",
        variant === 'h5' && "text-lg sm:text-xl",
        variant === 'h6' && "text-base sm:text-lg",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
