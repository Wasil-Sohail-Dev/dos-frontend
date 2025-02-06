import ButtonWithLoading from "component/LoadingButton";
import React, { useState, useRef, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { AlDocsSummaryApi } from "store/summary/services";
import AudioWaveform from "component/Layout/Dashboard/AudioWaveform";
import AudioRecorder from "component/Layout/Dashboard/AudioRecorder";
import SideModal from "component/Layout/Dashboard/SideModal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getallDocsFunApi, UploadDocumentApi } from "store/document/services";
import { useLocation } from "react-router";
import { FaDownload, FaCopy, FaSearch } from "react-icons/fa";
import Pagination from "component/Layout/Common/Pagination";

export const Summaries = () => {
  const location = useLocation();
  const [showSpeechSection, setShowSpeechSection] = useState(false);
  const [file, setFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [summary, setSummary] = useState();
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { isLoading } = useSelector((state) => state.summary.summary);
  const { data: allDocs, isLoading: docsLoading } = useSelector(
    (state) => state.document.documentAll
  );
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 5;

  const folderName = location.state?.folderName;
  console.log(folderName, "folderName");

  const dispatch = useDispatch();
  const audioRecorderRef = useRef(null);

  // Handle automatic recording when redirected from Home
  useEffect(() => {
    const startRecording = async () => {
      if (folderName === "Record Speech") {
        setShowSpeechSection(true);
        setShowSummaryModal(false);

        // Small delay to ensure component is mounted
        setTimeout(async () => {
          if (audioRecorderRef.current) {
            const started = await audioRecorderRef.current?.startRecording();
            if (started) {
              setIsRecording(true);
            }
          }
        }, 500);
      }
    };

    startRecording();

    // Clear the location state
    if (location.state) {
      window.history.replaceState({}, document.title);
    }
  }, [folderName]);

  useEffect(() => {
    dispatch(
      getallDocsFunApi({
        onSuccess: () => {},
        isSummaryDocs: true,
      })
    );
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const validationSchema = Yup.object({
    folderName: Yup.string().required("Folder Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      folderName: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setIsGenerating(true);

      const user = JSON.parse(localStorage.getItem("user"));

      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      if (audioFile) {
        formData.append("file", audioFile);
      }
      formData.append("id", user?.id);
      formData.append("folderName", values.folderName);
      formData.append("summary", summary);

      dispatch(
        UploadDocumentApi({
          data: formData,
          onSuccess: () => {
            setFile(null);
            setAudioFile(null);
            setSummary(null);
            setShowModal(false);
            setIsGenerating(false);
            dispatch(
              getallDocsFunApi({
                onSuccess: () => {},
              })
            );
          },
          onError: () => {
            setIsGenerating(false);
          },
        })
      );
    },
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file && !audioFile) {
      alert("Please select a file before uploading.");
      return;
    }
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    if (audioFile) {
      formData.append("file", audioFile);
    }
    dispatch(
      AlDocsSummaryApi({
        data: formData,
        isFile: file ? true : false,
        onSuccess: (data) => {
          setSummary(data);
        },
        onError: (error) => {
          console.error("Upload failed", error);
        },
      })
    );
  };

  const handleRecording = async () => {
    if (isRecording) {
      audioRecorderRef.current?.stopRecording();
      setIsRecording(false);
    } else {
      setAudioUrl(null);

      const started = await audioRecorderRef.current?.startRecording();
      if (started) {
        setIsRecording(true);
      }
    }
  };

  const handleRecordingComplete = async (url) => {
    setAudioUrl(url);
    setIsRecording(false);

    const medicalPrefixes = [
      "patient-audio",
      "medical-record",
      "health-note",
      "clinical-audio",
      "diagnosis-record",
      "consultation",
      "medical-note",
      "health-record",
    ];

    // Generate random filename with medical prefix
    const randomPrefix =
      medicalPrefixes[Math.floor(Math.random() * medicalPrefixes.length)];
    const timestamp = new Date().getTime();
    const filename = `${randomPrefix}-${timestamp}.wav`;

    // Convert the URL to a File object with the medical-themed filename
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const audioFile = new File([blob], filename, { type: "audio/wav" });
      setAudioFile(audioFile);
    } catch (error) {
      console.error("Error converting recording to file:", error);
    }
  };

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      if (isRecording) {
        audioRecorderRef.current?.stopRecording();
        setIsRecording(false);
      }
      setAudioUrl(null);
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setAudioFile(file);
    } else {
      alert("Please upload a valid audio file");
    }
  };

  const renderIcon = (fileUrl) => {
    const extension = fileUrl.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "wav":
      case "mp3":
        return "🎵";
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️";
      default:
        return "📁";
    }
  };

  const handleDelete = () => {
    setFile(null);
    setAudioFile(null);
    setAudioUrl(null);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCancel = () => {
    setFile(null);
    setAudioFile(null);
    setAudioUrl(null);
    setSummary(null);
    setShowModal(false);
  };

  const handleViewDoc = (doc) => {
    setSelectedDoc(doc);
    setShowSummaryModal(true);
  };

  const handleCloseSummaryModal = () => {
    setShowSummaryModal(false);
    setSelectedDoc(null);
  };

  const handleGenerateSummary = async (fileUrl) => {
    try {
      setIsGenerating(true);
      const formData = new FormData();
      formData.append("file", fileUrl);

      await dispatch(
        AlDocsSummaryApi({
          data: formData,
          isFile: true,
          onSuccess: (data) => {
            setSummary(data);
            dispatch(
              getallDocsFunApi({
                onSuccess: () => {},
                isSummaryDocs: true,
              })
            );
          },
          onError: (error) => {
            console.error("Summary generation failed", error);
          },
        })
      );
    } catch (error) {
      console.error("Error generating summary:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopyTooltip(true);
    setTimeout(() => setShowCopyTooltip(false), 2000);
  };

  const SummaryModal = ({ doc, onClose }) => {
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
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
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
                      const blob = new Blob([doc.summary], {
                        type: "text/plain",
                      });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${doc.fileUrl
                        .split("/")
                        .pop()}-summary.txt`;
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
                <p className="text-gray-500 italic mb-4">
                  No summary available for this document.
                </p>
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

  const renderSpeechSection = () => (
    <div className="flex flex-col items-center py-10">
      <div className="w-11/12 md:w-3/4 bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            {isRecording && (
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
                <span className="text-lg font-medium">
                  {formatTime(recordingTime)}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleRecording}
              className={`font-medium px-6 py-2 rounded-md ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              {isRecording ? "Stop Recording" : "Record Speech"}
            </button>
            <label
              className={`bg-blue-500 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-600 cursor-pointer`}
            >
              Upload Speech
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleAudioUpload}
              />
            </label>
          </div>
        </div>

        <AudioRecorder
          ref={audioRecorderRef}
          onRecordingComplete={handleRecordingComplete}
        />

        {isRecording && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-center items-center h-24">
              <div className="flex items-end space-x-1">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-blue-500 rounded-t"
                    style={{
                      height: `${Math.random() * 100}%`,
                      animation: "audio-wave 0.5s ease infinite",
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {audioUrl && !isRecording && (
          <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-4xl">
            <div className="relative">
              <AudioWaveform audioUrl={audioUrl} />
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes audio-wave {
            0% {
              height: ${Math.random() * 100}%;
            }
            50% {
              height: ${Math.random() * 100}%;
            }
            100% {
              height: ${Math.random() * 100}%;
            }
          }
        `}</style>

        <div className="w-full border border-blue-500 rounded-lg bg-blue-50 p-4 mt-6">
          <div className="flex justify-between items-start mb-2">
            {summary && (
              <h3 className="text-lg font-medium text-gray-700">Summary</h3>
            )}
            {summary && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const blob = new Blob([summary], { type: "text/plain" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `speech-summary.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  }}
                  className="p-1.5 rounded hover:bg-blue-100 transition-colors"
                >
                  <FaDownload className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleCopy(summary)}
                  className="p-1.5 rounded hover:bg-blue-100 transition-colors relative"
                >
                  <FaCopy className="w-4 h-4 text-gray-600" />
                  {showCopyTooltip && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      Copied!
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-600">{summary}</p>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          {summary && (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
              >
                Cancel
              </button>
              <button
                onClick={handleOpenModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </>
          )}
          {!summary && audioFile && (
            <ButtonWithLoading
              onClick={handleUpload}
              isLoading={isLoading}
              className="bg-blue-500 text-white rounded-lg px-4 py-2"
            >
              Generate
            </ButtonWithLoading>
          )}
        </div>
      </div>
    </div>
  );

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
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="flex justify-center mt-6 mb-6">
        <button
          onClick={() => {
            setSummary(null);
            setFile(null);
            setAudioFile(null);
            setAudioUrl(null);
            setIsRecording(false);
            setShowSpeechSection(!showSpeechSection);
          }}
          className="bg-blue-500 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-600"
        >
          {showSpeechSection ? "Upload Document" : "Speech to Text"}
        </button>
      </div>

      {!showSpeechSection ? (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-2 lg:p-6">
          <div className="bg-white shadow-md rounded-lg p-4 w-full lg:w-1/2">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              File Name
            </h2>
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
                  <span className="text-gray-900 text-sm lg:text-base truncate mr-2">{file.name}</span>
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
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
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
      ) : (
        renderSpeechSection()
      )}

      {showModal && (
        <SideModal
          formik={formik}
          handleCloseModal={handleCloseModal}
          isLoading={isGenerating}
        />
      )}

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
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : allDocs && allDocs.length > 0 ? (
          <>
            <ul className="divide-y divide-gray-200">
              {getCurrentDocs().map((doc) => (
                <li
                  key={doc.docsId}
                  className="flex items-center justify-between p-3 lg:p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-2 lg:space-x-4 min-w-0">
                    <span className="text-xl lg:text-2xl flex-shrink-0">{renderIcon(doc.fileUrl)}</span>
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

      {showSummaryModal && (
        <SummaryModal doc={selectedDoc} onClose={handleCloseSummaryModal} />
      )}
    </div>
  );
};
