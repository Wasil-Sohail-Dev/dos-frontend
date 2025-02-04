import React, { useState } from "react";
import { useSelector } from "react-redux";

export const DashboardNavbar = () => {
  // Fetch user data from Redux store
  const { firstName, lastName, email } = useSelector((state) => state.auth.user) || {};
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <nav className="bg-[#3A8EF6] relative">
      {/* Main Navbar Content */}
      <div className="h-16 md:h-[96px] flex items-center justify-between px-4 md:px-6">
        {/* Greeting Section - with left padding for mobile menu button */}
        <div className="flex-shrink-0 pl-12 lg:pl-0">
          <h3 className="text-white text-lg md:text-2xl font-bold truncate">
            Hi, {firstName ? `${firstName} ${lastName}` : "Guest"}!
          </h3>
          <p className="text-white/80 text-xs md:text-sm">Welcome back!</p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-6">
          {/* Search Toggle for Mobile */}
          <button 
            className="md:hidden w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </button>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-full shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="ml-2 outline-none bg-transparent text-gray-600 w-40 lg:w-60"
            />
          </div>

          {/* Notification Icon */}
          <div className="relative">
            <div className="w-10 h-10 bg-white/10 md:bg-white rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5 text-white md:text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C8.67 6.165 8 7.388 8 9v5.159c0 .538-.214 1.055-.595 1.436L6 17h5m4 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              1
            </span>
          </div>

          {/* Profile Picture */}
          <div className="w-10 h-10 rounded-full border-2 border-yellow-400 overflow-hidden">
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className={`${isSearchVisible ? 'block' : 'hidden'} md:hidden absolute w-full px-4 py-3 bg-[#2D7FE7] shadow-lg`}>
        <div className="flex items-center bg-white px-4 py-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="ml-2 outline-none bg-transparent text-gray-600 w-full"
          />
        </div>
      </div>
    </nav>
  );
};
