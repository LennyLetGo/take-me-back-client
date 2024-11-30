import React, { useEffect, useRef, useState, useContext } from 'react';
import Hls from 'hls.js';
import axios from 'axios';
import { CollectionsContext } from '../context/CollectionsContext';
import { NowPlayingContext } from '../context/NowPlayingContext';
import { eventEmitter } from '../util/EventEmitter'; // Path to your event emitter

function HLSPlayer({ bundle }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const audioRef = useRef(null); // Reference to the audio element
  const playlist = useContext(NowPlayingContext).playlist
  const playlistIndex = useContext(NowPlayingContext).playlistIndex
  const setPlaylistIndex = useContext(NowPlayingContext).setPlaylistIndex
  const suggestedSong = useContext(NowPlayingContext).suggestedSong
  const setSuggestedSong = useContext(NowPlayingContext).setSuggestedSong
  const fetchSuggestedSong = useContext(NowPlayingContext).fetchSuggestedSong
  const setFetchSuggestedSong = useContext(NowPlayingContext).setFetchSuggestedSong
  const currentCollection = useContext(CollectionsContext).currentCollection
  
  const fetchSuggested = async () => {
    console.log('fetching Suggested song!')
    // Check resource and how to fetch suggested song
    if(bundle.context === 'tracklist') {
      // fetch suggested from tracklist
    }
    else if (bundle.context === 'collection') {
      if(playlist !== null) {
        //fetch from collection
        console.log('Current Song')
        console.log(playlist[playlistIndex])
        console.log('Current Collection')
        console.log(currentCollection)
      }
    }
  }
  // Dont double up on listeners
  eventEmitter.off('fetchSuggested', fetchSuggested)
  // I need to capture events when the track is loaded
  // eventEmitter.on('fetchSuggested', fetchSuggested)

  useEffect(() => {
    // Check if the browser supports HLS.js
    if (Hls.isSupported()) {
      const hls = new Hls();

      // Construct the playlist URL dynamically based on the fileId
      const playlistUrl = `http://localhost:5000/audio/${bundle.resource}`;

      // Attach the HLS instance to the audio element
      hls.loadSource(playlistUrl);
      hls.attachMedia(audioRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false); // Data loaded successfully, stop loading indicator
        //eventEmitter.emit('fetchSuggested')
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
  }, [bundle.resource]);


  // Playlist functions
  const handleOnEnded = (event) => {
    if(playlistIndex < playlist.length-1) {
      setPlaylistIndex(playlistIndex+1)
    }
    else {
      setPlaylistIndex(0)
    }
  }
  const handleSkip = (event) => {
    if(playlistIndex < playlist.length-1) {
      setPlaylistIndex(playlistIndex+1)
    }
    else {
      setPlaylistIndex(0)
    }
  }
  
  const handleRewind = (event) => {
    if(playlistIndex == 0) {
      setPlaylistIndex(playlist.length-1)
    }
    else {
      setPlaylistIndex(playlistIndex-1)
    }
  }

  return (
    <div>
      <div>
        <p><strong>{bundle.resource}</strong></p>
        <audio ref={audioRef} controls autoPlay onEnded={handleOnEnded}>
          <p>Your browser does not support HTML5 audio.</p>
        </audio>
      </div>
      <p onClick={handleSkip}>NEXT</p>
    </div>
  );
}

export default HLSPlayer;