import React from "react";

const ButtonWithLoading = ({ isLoading, disabled, children, ...props }) => {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled} // Disable the button during loading or when explicitly disabled
      className={`w-full bg-black text-white py-3 rounded-md flex items-center justify-center ${
        isLoading ? "opacity-70 cursor-not-allowed" : ""
      }`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin h-5 w-5 text-white mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default ButtonWithLoading;
