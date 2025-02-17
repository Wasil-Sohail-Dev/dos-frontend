import React from 'react';
import { FaCamera } from 'react-icons/fa';

const ProfilePicture = ({ previewUrl, firstName, fileInputRef, handleImageChange }) => {
  return (
    <div className="flex justify-start mb-8">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-4xl">
                {firstName?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600"
        >
          <FaCamera size={16} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default ProfilePicture; 