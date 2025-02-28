import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlDocsSummaryApi } from "store/summary/services";
import { getallDocsFunApi, UploadDocumentApi } from "store/document/services";
import { useLocation } from "react-router";
import SideModal from "component/Layout/Dashboard/SideModal";
import { useFormik } from "formik";
import * as Yup from "yup";
import SummaryModal from "component/Layout/Summaries/SummaryModal";
import SpeechSection from "component/Layout/Summaries/SpeechSection";
import DocumentList from "component/Layout/Summaries/DocumentList";
import FileUploadSection from "component/Layout/Summaries/FileUploadSection";

export const Summaries = () => {
  const location = useLocation();
  const [showSpeechSection, setShowSpeechSection] = useState(false);
  const [file, setFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [summary, setSummary] = useState();
  console.log("summary", summary);
  const [text, setText] = useState();
  const [docDetails, setdocDetails] = useState();
  console.log("docDetails", docDetails);

  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 5;

  const { isLoading } = useSelector((state) => state.summary.summary);
  const { data: allDocs, isLoading: docsLoading } = useSelector(
    (state) => state.document.documentAll
  );

  const dispatch = useDispatch();
  const audioRecorderRef = useRef(null);
  const folderName = location.state?.folderName;

  useEffect(() => {
    const startRecording = async () => {
      if (folderName === "Record Speech") {
        setShowSpeechSection(true);
        setShowSummaryModal(false);

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
    initialValues: { folderName: "" },
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  async function handleFormSubmit(values) {
    setIsGenerating(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const formData = new FormData();

    if (file) formData.append("file", file);
    if (audioFile) formData.append("file", audioFile);
    console.log("audio file1", audioFile);
    formData.append("id", user?.id);
    formData.append("folderName", values.folderName);
    if (file) {
      formData.append("summary", summary?.health_summary);
    }
    if (audioFile) {
      formData.append(
        "summary",
        Array.isArray(summary) && summary.length > 0
          ? summary[0]?.health_summary || summary[0]?.message || null
          : null
      );
    }
    if (audioFile) {
      formData.append(
        "text",
        Array.isArray(text) && text.length > 0 ? text[1].trim() : null
      );
    }

    if (!audioFile) {
      formData.append("docDetails", docDetails?.doctor_name);
    }

    try {
      await dispatch(
        UploadDocumentApi({
          data: formData,
          onSuccess: () => {
            setFile(null);
            setAudioFile(null);
            setSummary(null);
            setText(null);
            setdocDetails(null); // Reset doctor details as well
            setShowModal(false);
            setIsGenerating(false);
            dispatch(
              getallDocsFunApi({
                onSuccess: () => {},
                isSummaryDocs: true,
              })
            );
          },
          onError: () => setIsGenerating(false),
        })
      );
    } catch (error) {
      setIsGenerating(false);
    }
  }

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
    if (file) formData.append("file", file);
    if (audioFile) formData.append("file", audioFile);

    dispatch(
      AlDocsSummaryApi({
        data: formData,
        isFile: file ? true : false,
        onSuccess: (data) => {
          setText(data);
          setSummary(data);
          setdocDetails(data?.doctor_details); // Extract doctor details from response
        },
        onError: (error) => console.error("Upload failed", error),
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
      if (started) setIsRecording(true);
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
    const randomPrefix =
      medicalPrefixes[Math.floor(Math.random() * medicalPrefixes.length)];
    const timestamp = new Date().getTime();
    const filename = `${randomPrefix}-${timestamp}.wav`;

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

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

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
            setText(data);
            setSummary(data.message);
            setdocDetails(data?.doctor_details);
            dispatch(
              getallDocsFunApi({
                onSuccess: () => {},
                isSummaryDocs: true,
              })
            );
          },
          onError: (error) => console.error("Summary generation failed", error),
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
        <FileUploadSection
          file={file}
          handleFileChange={handleFileChange}
          handleDelete={handleDelete}
          handleUpload={handleUpload}
          isLoading={isLoading}
          summary={summary?.health_summary}
          handleCopy={handleCopy}
          showCopyTooltip={showCopyTooltip}
          handleCancel={handleCancel}
          handleOpenModal={handleOpenModal}
        />
      ) : (
        <SpeechSection
          isRecording={isRecording}
          recordingTime={recordingTime}
          handleRecording={handleRecording}
          handleAudioUpload={handleAudioUpload}
          audioRecorderRef={audioRecorderRef}
          onRecordingComplete={handleRecordingComplete}
          audioUrl={audioUrl}
          text={Array.isArray(text) && text.length > 0 ? text[1].trim() : null}
          summary={
            (Array.isArray(summary) && summary.length > 0
              ? summary[0]?.message
              : null) ||
            (Array.isArray(summary) && summary.length > 0
              ? summary[0]?.health_summary
              : null)
          }
          handleCopy={handleCopy}
          showCopyTooltip={showCopyTooltip}
          handleCancel={handleCancel}
          handleOpenModal={handleOpenModal}
          handleUpload={handleUpload}
          isLoading={isLoading}
          audioFile={audioFile}
          formatTime={formatTime}
        />
      )}

      {showModal && (
        <SideModal
          formik={formik}
          handleCloseModal={handleCloseModal}
          isLoading={isGenerating}
        />
      )}

      <DocumentList
        docsLoading={docsLoading}
        allDocs={allDocs}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        docsPerPage={docsPerPage}
        handleViewDoc={handleViewDoc}
        renderIcon={renderIcon}
      />

      {showSummaryModal && (
        <SummaryModal
          doc={selectedDoc}
          onClose={handleCloseSummaryModal}
          handleGenerateSummary={handleGenerateSummary}
          isGenerating={isGenerating}
        />
      )}
    </div>
  );
};
