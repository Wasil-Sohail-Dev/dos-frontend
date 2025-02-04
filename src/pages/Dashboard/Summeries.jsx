import ButtonWithLoading from "component/LoadingButton";
import React, { useState, useRef } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { AlDocsSummaryApi } from "store/summary/services";
import AudioWaveform from 'component/Layout/Dashboard/AudioWaveform';
import AudioRecorder from 'component/Layout/Dashboard/AudioRecorder';
// import { AlDocsSummaryApi } from "store/summary/services";

export const Summaries = () => {
  const [showSpeechSection, setShowSpeechSection] = useState(false);
  const [file, setFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [summary, setSummary] = useState();
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const { isLoading  } = useSelector((state) => state.summary.summary);

  const dispatch = useDispatch();
  const audioRecorderRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file&&!audioFile) {
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
        isFile: file?true:false,
        onSuccess: (data) => {
          console.log(data,"dadatadatata");
          
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

  const reports = [
    { name: "Medical lab report", time: "3m ago", type: "folder" },
    { name: "Heart Report", time: "3 days ago", type: "folder" },
    { name: "Brain report.pdf", time: "3 days ago", type: "document" },
    { name: "Normal Checkup", time: "7 days ago", type: "image" },
    { name: "Blood pressure report", time: "3m ago", type: "folder" },
    { name: "Heart Report", time: "3 days ago", type: "folder" },
    { name: "Heart Report.pdf", time: "3 days ago", type: "document" },
    { name: "Lab Report", time: "7 days ago", type: "image" },
  ];

  const renderIcon = (type) => {
    switch (type) {
      case "folder":
        return "📁";
      case "document":
        return "📄";
      case "image":
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
          <button className="bg-gray-200 text-gray-600 px-6 py-2 rounded-md hover:bg-gray-300">
            Save
          </button>
          {/* <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
            Generate Summary
          </button> */}
          <ButtonWithLoading
                onClick={handleUpload}
                isLoading={isLoading}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
              >
                Generate Summary
              </ButtonWithLoading>
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
              <p className="text-sm text-gray-600">{summary} </p>
            </div>
          </div>
        </div>
      ) : renderSpeechSection()}

      <div className="mt-8 max-w-4xl mx-auto bg-white shadow-md rounded-md overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {reports.map((report, index) => (
            <li key={index} className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{renderIcon(report.type)}</span>
                <div>
                  <p className="text-gray-800 font-medium">{report.name}</p>
                  <p className="text-gray-500 text-sm">{report.time}</p>
                </div>
              </div>
              <button className="px-2 py-1 text-gray-400 border border-gray-300 rounded-md hover:text-white hover:bg-blue-600">
                View
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between p-4 border-t">
          <p className="text-sm text-gray-500">5 results (Page 1 of 2)</p>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200">
              Previous
            </button>
            <button className="px-4 py-2 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
