import React from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { FaDownload, FaCopy } from 'react-icons/fa';
import ButtonWithLoading from 'component/LoadingButton';

const FileUploadSection = ({
  file,
  handleFileChange,
  handleDelete,
  handleUpload,
  isLoading,
  summary,
  handleCopy,
  showCopyTooltip,
  handleCancel,
  handleOpenModal
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-2 lg:p-6">
      <div className="bg-white shadow-md rounded-lg p-4 w-full lg:w-1/2">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">File Name</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg w-full p-4 lg:p-8 flex flex-col items-center justify-center text-gray-500">
          <svg
            className="h-8 lg:h-10 w-8 lg:w-10 text-gray-400 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v4m0 0h16m-16 0l16-16M16 12v8m0-8L8 4"
            />
          </svg>
          {!file ? (
            <p className="text-gray-500 text-center text-sm lg:text-base">
              No files uploaded yet.
            </p>
          ) : (
            <div className="flex items-center justify-between border border-blue-400 rounded-md p-2 lg:p-3 mb-3 w-full">
              <span className="text-gray-900 text-sm lg:text-base truncate mr-2">
                {file.name}
              </span>
              <button
                className="text-red-500 hover:text-red-700 flex-shrink-0"
                onClick={handleDelete}
              >
                <AiFillDelete size={20} />
              </button>
            </div>
          )}

          <label className="mt-4 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer text-sm lg:text-base hover:bg-blue-600 transition-colors">
            Select File
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
        <div className="flex gap-4 mt-4">
          <ButtonWithLoading
            onClick={handleUpload}
            isLoading={isLoading}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 text-sm lg:text-base w-full lg:w-auto"
          >
            Generate
          </ButtonWithLoading>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 w-full lg:w-1/2">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex justify-between items-center">
          <span>Summary</span>
          {summary && (
            <div className="flex items-center space-x-2 lg:space-x-4">
              <button
                onClick={() => {
                  const blob = new Blob([summary], { type: "text/plain" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `summary.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                }}
                className="text-gray-700 hover:text-gray-900 flex items-center"
              >
                <FaDownload size={16} />
              </button>
              <button
                onClick={() => handleCopy(summary)}
                className="text-gray-700 hover:text-gray-900 flex items-center relative"
              >
                <FaCopy size={16} />
                {showCopyTooltip && (
                  <div className="absolute -top-8 -right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    Copied!
                  </div>
                )}
              </button>
            </div>
          )}
        </h2>
        <div className="overflow-y-auto h-48 lg:h-72 border border-gray-300 rounded-lg p-4 mt-4">
          <p className="text-sm lg:text-base text-gray-600">{summary}</p>
        </div>
        {summary && (
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 text-sm lg:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleOpenModal}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm lg:text-base"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadSection; 