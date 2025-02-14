import React, { useEffect, useState } from "react";
import { AiOutlineFile } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  FaFilePdf,
  FaFileImage,
  FaFilePowerpoint,
  FaSearch,
} from "react-icons/fa";
import { MdDownload, MdDelete, MdEdit, MdFolder } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDocsFunApi,
  getallDocsFunApi,
  updateDocsCategoryApi,
} from "store/document/services";
import { IoClose } from "react-icons/io5";
import { getFileName, getFileType, getTimeAgo } from "helper/docsFunctions";
import Pagination from "component/Layout/Common/Pagination";

export const DocumentOverview = () => {
  const dispatch = useDispatch();
  const { data: allDocs } = useSelector((state) => state.document.documentAll);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 5;

  const fetchDocuments = () => {
    dispatch(
      getallDocsFunApi({
        onSuccess: () => {
          // Handle success if needed
        },
      })
    );
  };

  useEffect(() => {
    fetchDocuments();
  }, [dispatch]);

  // Extract unique categories for the dropdown
  const uniqueCategories = [
    ...new Set(allDocs?.map((doc) => doc.category) || []),
  ];

  // Filter documents based on search (filename or category)
  const filteredDocs =
    allDocs?.filter((doc) => {
      const fileName = getFileName(doc.fileUrl).toLowerCase();
      const category = doc.category.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      return fileName.includes(searchLower) || category.includes(searchLower);
    }) || [];

  // Calculate pagination
  const indexOfLastDoc = currentPage * docsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - docsPerPage;
  const currentDocs = filteredDocs.slice(indexOfFirstDoc, indexOfLastDoc);
  const totalPages = Math.ceil(filteredDocs.length / docsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleMoveToFolder = (doc) => {
    setSelectedDoc(doc);
    setSelectedCategory(doc.category);
    setShowMoveModal(true);
  };

  const handleMove = () => {
    if (!selectedDoc || !selectedCategory) return;

    // Find the category details from allDocs
    const targetCategory = allDocs.find(
      (doc) => doc.category === selectedCategory
    );
    if (!targetCategory) return;

    const data = {
      docsId: selectedDoc.docsId,
      category: selectedCategory,
      categoryId: targetCategory.categoryId,
    };

    dispatch(
      updateDocsCategoryApi({
        data,
        onSuccess: () => {
          setShowMoveModal(false);
          setSelectedDoc(null);
          setSelectedCategory("");
          fetchDocuments(); // Refresh the documents list
        },
      })
    );
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FaFilePdf className="text-red-500 text-xl" />;
      case "image":
        return <FaFileImage className="text-blue-500 text-xl" />;
      case "ppt":
        return <FaFilePowerpoint className="text-orange-500 text-xl" />;
      default:
        return <AiOutlineFile className="text-gray-500 text-xl" />;
    }
  };

  // const handleDeleteDocument = (docsId) => {
  //   console.log("docsId", docsId);
  //   setShowMoveModal(false);
  //   setSelectedDoc(null);
  //   setSelectedCategory("");
  //   dispatch(
  //     deleteDocsFunApi({
  //       data: JSON.stringify({ docsId }),
  //       onSuccess: () => {
  //         fetchDocuments();
  //       },
  //     })
  //   );
  // };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDeleteDocument = (docsId) => {
    console.log("docsId", docsId)
    setShowMoveModal(false)
    setSelectedDoc(null)
    setSelectedCategory("")
    dispatch(
      deleteDocsFunApi({
        data: { docsId }, 
        onSuccess: () => {
          fetchDocuments();
          console.log("Document deleted successfully!");
        },
      })
    );
  };



  return (
    <div className="flex flex-col items-center min-h-screen p-4 lg:p-10">
      <div className="w-full max-w-[900px] mb-6">
        <div className="flex justify-end">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search files or categories..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-[900px] bg-white rounded-lg shadow-sm">
        {currentDocs.map((doc, index) => {
          const fileName = getFileName(doc.fileUrl);
          const fileType = getFileType(fileName);
          const timeAgo = getTimeAgo(doc.createdAt);

          return (
            <div
              key={doc.docsId}
              className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getFileIcon(fileType)}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium truncate">
                    {fileName}
                  </p>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span>{timeAgo}</span>
                    <span>•</span>
                    <span>Category: {doc.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative group">
                  <button className="p-1 hover:bg-gray-100 rounded-full">
                    <BsThreeDotsVertical className="text-black" />
                  </button>
                  <div className="absolute right-0 -mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                    <button
                      onClick={() => handleDownload(doc.fileUrl, fileName)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <MdDownload className="mr-2" /> Download
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.docsId)}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                    >
                      <MdDelete className="mr-2" /> Delete
                    </button>
                    <button
                      onClick={() => handleMoveToFolder(doc)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <MdFolder className="mr-2" /> Move into Folder
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <MdEdit className="mr-2" /> Edit Label
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Show message when no results found */}
        {filteredDocs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <FaSearch className="text-4xl mb-2" />
            <p>No documents found matching your search.</p>
          </div>
        )}
        <div className="p-4 border-t">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalResults={filteredDocs.length}
          />
        </div>
      </div>

      {/* Move to Folder Modal showMoveModal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[42px] leading-[46px] font-bold">
                Choose Folder
              </h3>
              <button
                onClick={() => setShowMoveModal(false)}
                className="text-gray-500 hover:text-gray-700 absolute top-2 right-2"
              >
                <IoClose size={24} />
              </button>
            </div>
            <p>Choose the folder to move your file there.</p>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border-b border-gray-300 mb-8 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <div className=" w-full">
              <button
                onClick={handleMove}
                className="py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full text-[20px] leading-[34px] font-bold"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
