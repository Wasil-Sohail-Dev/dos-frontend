import React from 'react';

const AudioControls = ({ isPlaying, onPlayPause}) => {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <button
        onClick={onPlayPause}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        {isPlaying ? (
          <span>⏸️ Pause</span>
        ) : (
          <span>▶️ Play</span>
        )}
      </button>
    </div>
  );
};

export default AudioControls; 