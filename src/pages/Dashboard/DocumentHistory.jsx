import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Loader from "component/Loader";
import Pagination from "component/Layout/Common/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { getallDocsFunApi } from "store/document/services";

// Export the component correctly for lazy loading
const DocumentHistory = () => {
  const dispatch = useDispatch();
  const { data: allDocs, isLoading: docsLoading } = useSelector(
    (state) => state.document.documentAll
  );

  // Add state for search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 10; // You can adjust this or make it a prop

  // State for summary view modal
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  // Function to handle document viewing
  const handleViewDoc = (doc) => {
    if (doc?.summary) {
      setSelectedDoc(doc);
      setShowSummary(true);
    }
  };

  // Function to render the appropriate icon based on file type
  const renderIcon = (fileUrl) => {
    const extension = fileUrl.split(".").pop().toLowerCase();

    // Return different icons based on file extension
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "ppt":
      case "pptx":
        return "📊";
      case "txt":
        return "📃";
      default:
        return "📄";
    }
  };

  useEffect(() => {
    // Force refresh data on component mount
    dispatch(
      getallDocsFunApi({
        onSuccess: (data) => {
          console.log("Successfully loaded documents:", data);
        },
        onError: (error) => {
          console.error("Error loading documents:", error);
        },
        isSummaryDocs: true, // This ensures we're fetching documents with summaries
      })
    );
  }, [dispatch]);

  // Log when data changes to help debug
  useEffect(() => {
    console.log("Documents data updated:", allDocs);
  }, [allDocs]);

  const filteredDocs = React.useMemo(() => {
    if (!allDocs || !Array.isArray(allDocs)) {
      console.log("No documents or invalid data structure:", allDocs);
      return [];
    }

    return allDocs.filter((doc) => {
      if (!doc.fileUrl || !doc.category) {
        console.log("Invalid document structure:", doc);
        return false;
      }

      const fileName = doc.fileUrl.split("/").pop().toLowerCase();
      const category = doc.category.toLowerCase();
      const search = searchTerm.toLowerCase();
      return fileName.includes(search) || category.includes(search);
    });
  }, [allDocs, searchTerm]);

  const getCurrentDocs = () => {
    const indexOfLastDoc = currentPage * docsPerPage;
    const indexOfFirstDoc = indexOfLastDoc - docsPerPage;
    return filteredDocs.slice(indexOfFirstDoc, indexOfLastDoc);
  };

  return (
    <div className="mt-8 max-w-4xl mx-auto bg-white shadow-md rounded-md overflow-hidden">
      <h2 className="text-xl font-semibold p-4 border-b border-gray-200">
        Document History
      </h2>

      {/* Search Bar */}
      <div className="p-3 lg:p-4 border-b border-gray-200">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm lg:text-base"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {docsLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader />
        </div>
      ) : filteredDocs && filteredDocs.length > 0 ? (
        <>
          <ul className="divide-y divide-gray-200">
            {getCurrentDocs().map((doc) => (
              <li
                key={doc.docsId || doc._id}
                className="flex items-center justify-between p-3 lg:p-4 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-2 lg:space-x-4 min-w-0">
                  {/* Show details if available, else show "N/A" */}
                  <div>{doc?.docDetails || "N/A"}</div>

                  {/* File Icon */}
                  <span className="text-xl lg:text-2xl flex-shrink-0">
                    {renderIcon(doc.fileUrl)}
                  </span>

                  {/* Document Info */}
                  <div className="min-w-0">
                    <p className="text-gray-800 font-medium text-sm lg:text-base truncate">
                      {decodeURIComponent(doc.fileUrl.split("/").pop())}
                    </p>
                    <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-500">
                      <span className="truncate">{doc.category || "N/A"}</span>
                      <span>•</span>
                      <span className="whitespace-nowrap">
                        {doc.createdAt
                          ? new Date(doc.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 lg:space-x-3 ml-2 flex-shrink-0">
                  {doc?.summary && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full hidden sm:inline-block">
                      Summarized
                    </span>
                  )}
                  <button
                    onClick={() => handleViewDoc(doc)}
                    disabled={!doc?.summary}
                    className={`px-2 lg:px-3 py-1 text-xs lg:text-sm border rounded-md transition-colors whitespace-nowrap ${
                      doc?.summary
                        ? "text-white bg-blue-600 hover:bg-blue-700 border-blue-600"
                        : "text-gray-400 border-gray-200 cursor-not-allowed"
                    }`}
                  >
                    View Summary
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="p-3 lg:p-4 border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredDocs.length / docsPerPage)}
              onPageChange={setCurrentPage}
              totalResults={filteredDocs.length}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
          <svg
            className="w-12 lg:w-16 h-12 lg:h-16 mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm lg:text-base mb-2">
            No summarized documents found
          </p>
          <p className="text-xs text-gray-400">
            {allDocs
              ? `Found ${allDocs.length} documents but none have summaries`
              : "No documents loaded"}
          </p>
        </div>
      )}

      {/* Summary Modal */}
      {showSummary && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg">
                {decodeURIComponent(selectedDoc.fileUrl.split("/").pop())}
              </h3>
              <button
                onClick={() => setShowSummary(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Summary:
                </span>
                <div className="mt-2 text-gray-700 whitespace-pre-line">
                  {selectedDoc.summary}
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-4">
                <div>Category: {selectedDoc.category}</div>
                <div>
                  Created: {new Date(selectedDoc.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowSummary(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// This is the key change: make DocumentHistory the default export
export default DocumentHistory;
// Also add named export for direct imports
export { DocumentHistory };
