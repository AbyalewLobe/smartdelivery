import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  dark?: boolean;
}

export function Card({ children, className, onClick, hover, dark }: CardProps) {
  return (
    <div
      className={cn(
        dark
          ? 'bg-white/5 border border-white/10 rounded-2xl'
          : 'card',
        'transition-all duration-300 ease-out',
        (onClick || hover) && (dark
          ? 'cursor-pointer hover:-translate-y-1 hover:bg-white/10 hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-900/20'
          : 'cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/60'
        ),
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
