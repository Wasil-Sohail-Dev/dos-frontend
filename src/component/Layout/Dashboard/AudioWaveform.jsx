import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import AudioControls from './AudioControls';

const AudioWaveform = ({ audioUrl }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const formatTime = (time) => {
    if (!isFinite(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (audioUrl) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#3B82F6', // blue-500
        progressColor: '#2563EB', // blue-600
        cursorColor: '#EF4444', // red-500
        barWidth: 1,
        barHeight: 2,
        responsive: true,
        height: 64,
        normalize: true,
        backend: 'WebAudio'
      });

      wavesurfer.current.load(audioUrl);

      wavesurfer.current.on('ready', () => {
        const audioDuration = wavesurfer.current.getDuration();
        setDuration(audioDuration);
      });

      wavesurfer.current.on('audioprocess', () => {
        if (wavesurfer.current) {
          const currentTime = wavesurfer.current.getCurrentTime();
          setCurrentTime(currentTime);
        }
      });

      wavesurfer.current.on('seek', () => {
        if (wavesurfer.current) {
          const currentTime = wavesurfer.current.getCurrentTime();
          setCurrentTime(currentTime);
        }
      });

      return () => {
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
        }
      };
    }
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (wavesurfer.current) {
      wavesurfer.current.on('finish', () => {
        setIsPlaying(false);
        setCurrentTime(duration);
      });
    }
  }, [duration]);

  return (
    <div>
      <div className="relative bg-gray-200 rounded-md overflow-hidden">
        <div ref={waveformRef} />
      </div>
      <div className="flex justify-between text-gray-500 text-sm mt-2">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <AudioControls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
      />
    </div>
  );
};

export default AudioWaveform; 