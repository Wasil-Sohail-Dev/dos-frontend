import React, { useState } from 'react';
import { FaDownload, FaCopy } from 'react-icons/fa';
import ButtonWithLoading from 'component/LoadingButton';

const SummaryModal = ({ doc, onClose, handleGenerateSummary, isGenerating }) => {
  const [showModalCopyTooltip, setShowModalCopyTooltip] = useState(false);

  const handleModalCopy = (text) => {
    navigator.clipboard.writeText(text);
    setShowModalCopyTooltip(true);
    setTimeout(() => setShowModalCopyTooltip(false), 2000);
  };

  if (!doc) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {decodeURIComponent(doc.fileUrl.split("/").pop())}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
              <span>{doc.category}</span>
              <span>•</span>
              <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="border-t border-b border-gray-200 py-4 my-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-gray-700">Summary</h3>
            {doc.summary && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    const blob = new Blob([doc.summary], { type: "text/plain" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${doc.fileUrl.split("/").pop()}-summary.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  }}
                  className="text-gray-700 hover:text-gray-900 flex items-center space-x-2"
                >
                  <FaDownload size={18} />
                </button>
                <button
                  onClick={() => handleModalCopy(doc.summary)}
                  className="text-gray-700 hover:text-gray-900 flex items-center space-x-2 relative"
                >
                  <FaCopy size={18} />
                  {showModalCopyTooltip && (
                    <div className="absolute -top-8 -right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Copied!
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
          {doc.summary ? (
            <p className="text-gray-600 whitespace-pre-wrap">{doc.summary}</p>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 italic mb-4">No summary available for this document.</p>
              <ButtonWithLoading
                onClick={() => handleGenerateSummary(doc.fileUrl)}
                isLoading={isGenerating}
                disabled={isGenerating}
                className="px-4 py-2 bg-[#4285F4] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Summary
              </ButtonWithLoading>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Open Document
          </a>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal; 