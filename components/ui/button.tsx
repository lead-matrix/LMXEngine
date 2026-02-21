import React from 'react';
import './Button.css'; // Optional: If you want to include styles.

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <button className="button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;