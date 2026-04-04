import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-sm flex items-center justify-center';
  const variants = {
    primary: 'btn-gold',
    secondary: 'bg-white text-rose-700 border border-rose-100 hover:shadow-md',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
