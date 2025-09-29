// Shared Button component
import React from 'react';
import './Button.css';

function Button({ children, ...props }) {
  return (
    <button className="button" {...props}>
      {children}
    </button>
  );
}

export default Button;
