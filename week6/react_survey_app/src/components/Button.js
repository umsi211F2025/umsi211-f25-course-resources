// Shared Button component
import './Button.css';

function Button({ children, ...props }) {
  return (
    <button className="button" {...props}>
      {children}
    </button>
  );
}

export default Button;
