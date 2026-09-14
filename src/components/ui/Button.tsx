import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  className?: string;
  onClick?: (e?: React.MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  showArrow?: boolean;
}

export function Button({
  children,
  href,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  showArrow,
}: ButtonProps) {
  const baseStyles = 'px-8 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-300 inline-flex items-center gap-2 select-none active:scale-[0.98] transform-gpu disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary: 'bg-charcoal text-ivory hover:bg-charcoal/90 hover:shadow-md shadow-sm',
    secondary: 'bg-ivory text-charcoal border border-charcoal/20 hover:bg-beige hover:border-charcoal/30',
    ghost: 'text-charcoal hover:text-charcoal/70 underline underline-offset-4 bg-transparent px-0 py-1 rounded-none',
    outline: 'border border-ivory/30 text-ivory hover:bg-ivory/10 hover:border-ivory',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;
  const displayArrow = showArrow !== undefined ? showArrow : (variant === 'primary' || variant === 'outline');

  const content = (
    <>
      <span>{children}</span>
      {displayArrow && <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-0.5" />}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClassName} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button 
      type={type} 
      className={combinedClassName} 
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}

export default Button;
