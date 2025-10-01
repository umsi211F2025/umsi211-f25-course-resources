// Shared Button component
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

function Button({ children, ...props }: ButtonProps) {
  return (
    <button className="button" {...props}>
      {children}
    </button>
  );
}

export default Button;
