import React, { useRef } from 'react';

const AudioRecorder = React.forwardRef(({ onRecordingComplete }, ref) => {
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const streamRef = useRef(null);

  React.useImperativeHandle(ref, () => ({
    startRecording: async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        mediaRecorder.current = new MediaRecorder(stream);
        audioChunks.current = [];

        mediaRecorder.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };

        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          onRecordingComplete(audioUrl);
          
          // Clean up
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
        };

        mediaRecorder.current.start(100); // Collect data every 100ms
        return true;
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Error accessing microphone. Please ensure you have granted permission.');
        return false;
      }
    },
    stopRecording: () => {
      if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
        mediaRecorder.current.stop();
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      }
    }
  }));

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return null;
});

AudioRecorder.displayName = 'AudioRecorder';
export default AudioRecorder; 