import React from 'react'
import { FaArrowUpLong } from "react-icons/fa6";

const PreviewChart = ({ message, setMessage, handleSubmit, isLoading }) => {

  return (
    <div className="flex flex-col items-center mt-40">
      <h1 className="text-[32px] lg:text-[48px] font-bold mb-4 text-gray-800 leading-[70px] ">What can I help with?</h1>
      <div className="w-full">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a Message"
            className="w-full p-4 pr-12 rounded-[10px] border border-[#33363F] focus:outline-none focus:border-blue-500 text-base font-normal leading-[28px]"
            disabled={isLoading}
          />
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1 justify-center items-center'>
          <button
            type="submit"
            className={`bg-blue-500 text-white p-2 rounded-lg ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            <FaArrowUpLong />
          </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PreviewChart