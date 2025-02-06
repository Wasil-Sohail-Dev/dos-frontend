import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDocsFunApi, getallDocsFunApi } from "store/document/services";
import { FaEllipsisV, FaFolder, FaTrash, FaSearch } from "react-icons/fa";
import Pagination from "component/Layout/Common/Pagination";

export const DocumentManagement = () => {
  const dispatch = useDispatch();
  const [groupedDocs, setGroupedDocs] = useState({});
  const [openFolders, setOpenFolders] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 5;

  const { data: allDocs, isLoading } = useSelector(
    (state) => state.document.documentAll
  );

  const fetchDocuments = () => {
    dispatch(
      getallDocsFunApi({
        onSuccess: () => {},
      })
    );
  };

  useEffect(() => {
    fetchDocuments();
  }, [dispatch]);

  useEffect(() => {
    if (allDocs?.length > 0) {
      const grouped = allDocs.reduce((acc, doc) => {
        acc[doc.category] = acc[doc.category] || [];
        acc[doc.category].push(doc);
        return acc;
      }, {});
      setGroupedDocs(grouped);
    }
  }, [allDocs]);

  const toggleFolder = (category) => {
    setOpenFolders((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const handleDeleteDocument = (docsId) => {
    setOpenFolders({});
    setGroupedDocs({});
    dispatch(
      deleteDocsFunApi({
        data: JSON.stringify({ docsId }),
        onSuccess: () => {
          fetchDocuments();
        },
      })
    );
  };

  const calculateFolderSize = (files) => {
    const totalBytes = files.reduce((acc, file) => {
      return acc + (file.size || 0);
    }, 0);

    if (totalBytes >= 1024 * 1024 * 1024) {
      return (totalBytes / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    } else if (totalBytes >= 1024 * 1024) {
      return (totalBytes / (1024 * 1024)).toFixed(2) + "MB";
    } else if (totalBytes >= 1024) {
      return (totalBytes / 1024).toFixed(0) + "KB";
    }
    return totalBytes + "B";
  };

  // Filter categories based on search
  const filteredCategories = Object.entries(groupedDocs).filter(([category]) =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6 min-h-screen bg-white">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end mb-6">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {currentCategories.map(([category, files]) => (
            <div
              key={category}
              className="border-b border-gray-100 last:border-b-0"
            >
              <div
                className="flex items-center justify-between py-6 px-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleFolder(category)}
              >
                <div className="flex items-center space-x-4">
                  <FaFolder className="text-[#FFC107] text-3xl" />
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-700 text-lg font-medium">
                      {category}
                    </span>
                    <span className="text-gray-500 text-base">
                      ({files.length})
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-base text-gray-500">
                    {calculateFolderSize(files)}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaEllipsisV size={20} />
                  </button>
                </div>
              </div>

              {openFolders[category] && (
                <div className="pl-12 pr-6 pb-4">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-4 hover:bg-gray-50 rounded-lg px-4"
                    >
                      <div
                        className="flex items-center space-x-4 cursor-pointer"
                        onClick={() => window.open(file.fileUrl, "_blank")}
                      >
                        <span className="text-base text-gray-700">
                          {decodeURIComponent(file.fileUrl.split("/").pop())}
                        </span>
                      </div>
                      <button
                        className="text-red-400 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDocument(file.docsId);
                        }}
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="p-4 border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalResults={filteredCategories.length}
            />
          </div>
        </div>
      )}
    </div>
  );
};
