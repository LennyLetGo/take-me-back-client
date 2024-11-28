import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

function HLSPlayer({ fileId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const audioRef = useRef(null); // Reference to the audio element

  useEffect(() => {
    // Check if the browser supports HLS.js
    if (Hls.isSupported()) {
      const hls = new Hls();

      // Construct the playlist URL dynamically based on the fileId
      const playlistUrl = `http://localhost:5000/audio/${fileId}`;

      // Attach the HLS instance to the audio element
      hls.loadSource(playlistUrl);
      hls.attachMedia(audioRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false); // Data loaded successfully, stop loading indicator
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setError('Failed to load HLS stream');
        }
      });

      // Cleanup the HLS instance when the component is unmounted
      return () => {
        hls.destroy();
      };
    } else {
      setError('HLS is not supported in this browser.');
    }
  }, [fileId]);

  return (
    <div>
    <p><strong>{fileId}</strong></p>
      <audio ref={audioRef} controls>
        <p>Your browser does not support HTML5 audio.</p>
      </audio>
    </div>
  );
}

export default HLSPlayer;