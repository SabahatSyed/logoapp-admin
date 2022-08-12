import React from "react";

const Button = ({ fullWidth, children, alt, onClick, type, disabled }) => {
  return (
    <button
      className={`${
        alt
          ? "border border-red-500 text-red-500 hover:text-white hover:bg-red-500"
          : `${
              disabled
                ? `opacity-60`
                : `bg-primary-500 active:scale-100 hover:scale-110 
                  hover:bg-primary-400 hover:drop-shadow-xl hover:shadow-lg hover:shadow-zinc-400 active:drop-shadow-md active:shadow-md active:shadow-zinc-300`
            } `
      } ${
        fullWidth && "w-full"
      } transition-all duration-200 py-[1em] px-[1.5em] rounded-2xl`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
