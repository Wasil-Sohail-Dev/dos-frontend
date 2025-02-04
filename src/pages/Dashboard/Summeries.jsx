import ButtonWithLoading from "component/LoadingButton";
import React, { useState, useRef, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { AlDocsSummaryApi } from "store/summary/services";
import AudioWaveform from 'component/Layout/Dashboard/AudioWaveform';
import AudioRecorder from 'component/Layout/Dashboard/AudioRecorder';
import SideModal from "component/Layout/Dashboard/SideModal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getallDocsFunApi, UploadDocumentApi } from "store/document/services";

export const Summaries = () => {
  const [showSpeechSection, setShowSpeechSection] = useState(false);
  const [file, setFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [summary, setSummary] = useState();
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const { isLoading  } = useSelector((state) => state.summary.summary);
  const { data: allDocs, isLoading:docsLoading } = useSelector((state) => state.document.documentAll);


  useEffect(() => {
    dispatch(getallDocsFunApi({
      onSuccess: () => {
      },
      isSummaryDocs:true,
    }));
  }, []);


  const dispatch = useDispatch();
  const audioRecorderRef = useRef(null);


  const validationSchema = Yup.object({
    folderName: Yup.string().required("Folder Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      folderName: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const user = JSON.parse(localStorage.getItem("user"));

      const formData = new FormData();
      if(file) {
        formData.append("file", file);
      }
      if(audioFile) {
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
            dispatch(getallDocsFunApi({

              onSuccess: () => {
              },
            }));
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
    if(file){
      formData.append("file", file);
    }
    if(audioFile){
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
      'patient-audio',
      'medical-record',
      'health-note',
      'clinical-audio',
      'diagnosis-record',
      'consultation',
      'medical-note',
      'health-record'
    ];
    
    // Generate random filename with medical prefix
    const randomPrefix = medicalPrefixes[Math.floor(Math.random() * medicalPrefixes.length)];
    const timestamp = new Date().getTime();
    const filename = `${randomPrefix}-${timestamp}.wav`;
    
    // Convert the URL to a File object with the medical-themed filename
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const audioFile = new File([blob], filename, { type: 'audio/wav' });
      setAudioFile(audioFile);
    } catch (error) {
      console.error('Error converting recording to file:', error);
    }
  };

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
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
      alert('Please upload a valid audio file');
    }
  };

  const renderIcon = (fileUrl) => {
    const extension = fileUrl.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return "📄";
      case 'wav':
      case 'mp3':
        return "🎵";
      case 'jpg':
      case 'jpeg':
      case 'png':
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

  const SummaryModal = ({ doc, onClose }) => {
    if (!doc) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl p-6 m-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {decodeURIComponent(doc.fileUrl.split('/').pop())}
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="border-t border-b border-gray-200 py-4 my-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Summary</h3>
            {doc.summary ? (
              <p className="text-gray-600 whitespace-pre-wrap">{doc.summary}</p>
            ) : (
              <p className="text-gray-500 italic">No summary available for this document.</p>
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
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSpeechSection = () => (
    <div className="flex flex-col items-center bg-gray-100 py-10">
      <div className="w-11/12 md:w-3/4 bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-end gap-4 mb-6">
          <button
            onClick={handleRecording}
            className={`font-medium px-6 py-2 rounded-md ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isRecording ? 'Stop Recording' : 'Record Speech'}
          </button>
          <label className={`bg-blue-500 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-600 cursor-pointer`}>
            Upload Speech
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleAudioUpload}
            />
          </label>
        </div>

        <AudioRecorder ref={audioRecorderRef} onRecordingComplete={handleRecordingComplete} />

        {audioUrl && (
          <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-4xl">
            <div className="relative">
              <AudioWaveform 
                audioUrl={audioUrl} 
              />
            </div>
          </div>
        )}

        <div className="w-full border border-blue-500 rounded-lg bg-blue-50 p-4 mt-6">
          <p className="text-gray-600 mb-2">
            {summary}
          </p>
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
            setShowSpeechSection(!showSpeechSection)
          }}
          className="bg-blue-500 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-600"
        >
          {showSpeechSection ? "Upload Document" : "Speech to Text"}
        </button>
      </div>

      {!showSpeechSection ? (
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100">
          <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/2">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              File Name
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg w-full p-8 flex flex-col items-center justify-center text-gray-500">
              <svg
                className="h-10 w-10 text-gray-400 mb-4"
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
                <p className="text-gray-500 text-center">
                  No files uploaded yet.
                </p>
              ) : (
                <div className="flex items-center justify-between border border-blue-400 rounded-md p-3 mb-3">
                  <span className="text-gray-900">{file.name}</span>

                  <button className="text-red-500 hover:text-red-700" onClick={handleDelete}>
                    <AiFillDelete size={20} />
                  </button>

                </div>
              )}

              <label className="mt-4 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
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
                className="bg-blue-500 text-white rounded-lg px-4 py-2"
              >
                Generate
              </ButtonWithLoading>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/2">
            <h2 className="text-lg font-semibold text-gray-700">Summary</h2>
            <div className="overflow-y-auto h-72 border border-gray-300 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-600">{summary}</p>
            </div>
            {summary && (
              <div className="flex justify-end gap-4 mt-4">
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
              </div>
            )}
          </div>
        </div>
      ) : renderSpeechSection()}

      {showModal && (
        <SideModal formik={formik} handleCloseModal={handleCloseModal} />
      )}

      <div className="mt-8 max-w-4xl mx-auto bg-white shadow-md rounded-md overflow-hidden">
        {docsLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : allDocs && allDocs.length > 0 ? (
          <>
            <ul className="divide-y divide-gray-200">
              {allDocs.map((doc) => (
                <li key={doc.docsId} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{renderIcon(doc.fileUrl)}</span>
                    <div>
                      <p className="text-gray-800 font-medium">
                        {decodeURIComponent(doc.fileUrl.split('/').pop())}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{doc.category}</span>
                        <span>•</span>
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc?.summary && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Summarized
                      </span>
                    )}
                    <button 
                      onClick={() => handleViewDoc(doc)}
                      disabled={!doc?.summary}
                      className="px-3 py-1 text-gray-600 border border-gray-300 rounded-md hover:text-white hover:bg-blue-600 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-gray-500">{allDocs.length} documents</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <svg
              className="w-16 h-16 mb-4 text-gray-400"
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
            <p>No documents found</p>
          </div>
        )}
      </div>

      {showSummaryModal && (
        <SummaryModal doc={selectedDoc} onClose={handleCloseSummaryModal} />
      )}
    </div>
  );
};
