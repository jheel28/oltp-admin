// Button.js
import React from "react";

const Button = ({ label, onClick, className, style,icon }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-full flex m-4 ${className}`}
      style={style}
    >
    {icon && <span className= "mr-2">{icon}</span>}
      {label}
    </button>
  );
};

export default Button;
