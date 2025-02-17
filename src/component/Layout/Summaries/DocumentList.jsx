import React from 'react';
import { FaSearch } from 'react-icons/fa';
import Loader from 'component/Loader';
import Pagination from 'component/Layout/Common/Pagination';

const DocumentList = ({
  docsLoading,
  allDocs,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  docsPerPage,
  handleViewDoc,
  renderIcon
}) => {
  const filteredDocs = React.useMemo(() => {
    if (!allDocs) return [];
    return allDocs.filter((doc) => {
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
        <Loader />
      ) : allDocs && allDocs.length > 0 ? (
        <>
          <ul className="divide-y divide-gray-200">
            {getCurrentDocs().map((doc) => (
              <li
                key={doc.docsId}
                className="flex items-center justify-between p-3 lg:p-4 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-2 lg:space-x-4 min-w-0">
                  <span className="text-xl lg:text-2xl flex-shrink-0">
                    {renderIcon(doc.fileUrl)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-gray-800 font-medium text-sm lg:text-base truncate">
                      {decodeURIComponent(doc.fileUrl.split("/").pop())}
                    </p>
                    <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-500">
                      <span className="truncate">{doc.category}</span>
                      <span>•</span>
                      <span className="whitespace-nowrap">
                        {new Date(doc.createdAt).toLocaleDateString()}
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
                    className="px-2 lg:px-3 py-1 text-xs lg:text-sm text-gray-600 border border-gray-300 rounded-md hover:text-white hover:bg-blue-600 transition-colors whitespace-nowrap"
                  >
                    View
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
          <p className="text-sm lg:text-base">No documents found</p>
        </div>
      )}
    </div>
  );
};

export default DocumentList; 