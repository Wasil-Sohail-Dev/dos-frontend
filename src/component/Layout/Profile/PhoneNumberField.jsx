import React from 'react';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneNumberField = ({ value, onChange, error, touched }) => {
  return (
    <div className="w-full lg:w-[49.2%]">
      <label className="bg-white px-1 text-sm">Phone Number</label>
      <PhoneInput
        international
        country="us"
        value={value}
        onChange={onChange}
        inputStyle={{
          width: "100%",
          height: "50px",
          borderRadius: "8px",
          border: touched && error ? "1px solid red" : "1px solid #ced4da",
        }}
        buttonStyle={{
          border: touched && error ? "1px solid red" : "1px solid #ced4da",
        }}
      />
      {touched && error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default PhoneNumberField; 