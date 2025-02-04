import React, { useEffect, useState } from "react";
import { AiOutlineCloudUpload, AiOutlineFile, AiOutlineFolder } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaFilePdf, FaFileImage, FaFilePowerpoint } from "react-icons/fa";
import { MdError, MdDownload, MdDelete, MdEdit, MdFolder } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { deleteDocsFunApi, getallDocsFunApi, updateDocsCategoryApi } from "store/document/services";
import { IoClose } from "react-icons/io5";
import { getFileName, getFileType, getTimeAgo } from "helper/docsFunctions";

export const DocumentOverview = () => {
  const dispatch = useDispatch();
  const { data: allDocs, isLoading } = useSelector((state) => state.document.documentAll);
  console.log("allDocs",allDocs)
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchDocuments = () => {
    dispatch(
      getallDocsFunApi({
        onSuccess: () => {
          // Handle success if needed
        },
      })
    );
  }

  useEffect(() => {
    fetchDocuments();
  }, [dispatch]);

  // Extract unique categories for the dropdown
  const uniqueCategories = [...new Set(allDocs?.map(doc => doc.category) || [])];



  const handleMoveToFolder = (doc) => {
    setSelectedDoc(doc);
    setSelectedCategory(doc.category);
    setShowMoveModal(true);
  };

  const handleMove = () => {
    if (!selectedDoc || !selectedCategory) return;

    // Find the category details from allDocs
    const targetCategory = allDocs.find(doc => doc.category === selectedCategory);
    if (!targetCategory) return;

    const data = {
      docsId: selectedDoc.docsId,
      category: selectedCategory,
      categoryId: targetCategory.categoryId
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
    <div className="flex flex-col justify-center items-center min-h-screen p-4 lg:p-10">
      {/* Upload Section */}
      <div className="w-full max-w-[900px] bg-white rounded-2xl border-2 border-dashed border-gray-200 mb-6">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <AiOutlineCloudUpload className="text-gray-400 text-3xl" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">Select a file or drag and drop here</p>
              <p className="text-gray-500 text-sm">JPG, PNG or PDF, file size no more than 10MB</p>
            </div>
          </div>
          <button className="w-full sm:w-auto px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors">
            SELECT FILE
          </button>
        </div>
      </div>

      {/* Files List */}
      <div className="w-full max-w-[900px] bg-white rounded-lg shadow-sm">
        {allDocs?.map((doc, index) => {
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
                  <p className="text-gray-900 font-medium truncate">{fileName}</p>
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
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <MdDownload className="mr-2" /> Download
                    </button>
                    <button 
                      onClick={() => handleDeleteDocument(doc.docsId)}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100">
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
      </div>

      {/* Move to Folder Modal showMoveModal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[42px] leading-[46px] font-bold">Choose Folder</h3>
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
