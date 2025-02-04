import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDocsFunApi, getallDocsFunApi } from "store/document/services";
import { FaFolder, FaChevronDown, FaChevronUp, FaFilePdf, FaTrash } from "react-icons/fa";

export const DocumentManagement = () => {
  const dispatch = useDispatch();
  const [groupedDocs, setGroupedDocs] = useState({});
  const [openFolders, setOpenFolders] = useState({});

  const { data: allDocs, isLoading } = useSelector((state) => state.document.documentAll);
  console.log("allDocs",allDocs)

  const fetchDocuments = () => {
    dispatch(
      getallDocsFunApi({
        onSuccess: () => {
        },
      })
    );
  }

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
    setOpenFolders({})
    setGroupedDocs({})
    dispatch(
      deleteDocsFunApi({
        data: JSON.stringify({ docsId }), 
        onSuccess: () => {
          fetchDocuments();
          console.log("Document deleted successfully!");
        },
      })
    );
  };
  return (
    <div className="p-6 min-h-screen">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Document Management</h2>
    {isLoading ? (
      <div className="flex justify-center items-center h-64">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
        <span className="ml-2 text-gray-500 text-lg">Loading documents...</span>
      </div>
    ) : (
      <div className="space-y-6">
        {Object.keys(groupedDocs).map((category) => (
          <div
            key={category}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
          >
            {/* Folder Header */}
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleFolder(category)}
            >
              <div className="flex items-center">
                <FaFolder className="text-yellow-500 text-4xl mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
                  <p className="text-sm text-gray-500">
                    {groupedDocs[category].length} files
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {openFolders[category] ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
                {/* <FaTrash
                  className="text-red-500 cursor-pointer hover:text-red-700"
                  title="Delete Folder"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(category);
                  }}
                /> */}
              </div>
            </div>

            {/* Folder Content */}
            {openFolders[category] && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedDocs[category].map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className="flex items-center space-x-3"
                      onClick={() => window.open(file.fileUrl, "_blank")}
                    >
                      <FaFilePdf className="text-red-500 text-2xl" />
                      <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                        {file.fileUrl.split("/").pop().length > 30 ? file.fileUrl.split("/").pop().slice(0,30) : file.fileUrl.split("/").pop()}
                      </span>
                    </div>
                    <FaTrash
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      title="Delete Document"
                      onClick={() => handleDeleteDocument(file.docsId)}
                    />
                  </div>


                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
  );
};
