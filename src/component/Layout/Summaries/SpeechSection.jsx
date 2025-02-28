import React from "react";
import { FaDownload, FaCopy } from "react-icons/fa";
import ButtonWithLoading from "component/LoadingButton";
import AudioRecorder from "component/Layout/Dashboard/AudioRecorder";
import AudioWaveform from "component/Layout/Dashboard/AudioWaveform";

const SpeechSection = ({
  isRecording,
  recordingTime,
  handleRecording,
  handleAudioUpload,
  audioRecorderRef,
  onRecordingComplete,
  audioUrl,
  summary,
  text,
  handleCopy,
  showCopyTooltip,
  handleCancel,
  handleOpenModal,
  handleUpload,
  isLoading,
  audioFile,
  formatTime,
}) => {
  console.log("text", text);

  console.log("summary in speech section", summary);
  console.log("runnin");
  return (
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
            <label className="bg-blue-500 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-600 cursor-pointer">
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
          onRecordingComplete={onRecordingComplete}
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
          {text && <h3 className="text-lg font-medium text-gray-700">Text</h3>}
          <p className="text-gray-600">{text}</p>
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
};

export default SpeechSection;
