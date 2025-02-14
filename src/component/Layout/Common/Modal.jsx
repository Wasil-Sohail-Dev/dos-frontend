import React from 'react';
import { IoClose } from "react-icons/io5";

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  subtitle,
  children 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[24px] font-bold">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 absolute top-2 right-2"
          >
            <IoClose size={24} />
          </button>
        </div>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
} 