import React from 'react';

const FormField = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  type = "text",
  className = ""
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label className="bg-white px-1 text-sm">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={`w-full p-3 border rounded-md ${
          touched && error ? "border-red-500" : ""
        }`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {touched && error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField; 