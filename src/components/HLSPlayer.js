import React, { useEffect, useRef, useState, useContext } from 'react';
import Hls from 'hls.js';
import axios from 'axios';
import { CollectionsContext } from '../context/CollectionsContext';
import { NowPlayingContext } from '../context/NowPlayingContext';
import { eventEmitter } from '../util/EventEmitter'; // Path to your event emitter
import TrackList from './TrackList';
import './HLSPlayer.css'

function HLSPlayer({ bundle }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const audioRef = useRef(null); // Reference to the audio element
  const playlist = useContext(NowPlayingContext).playlist
  const playlistIndex = useContext(NowPlayingContext).playlistIndex
  const setPlaylistIndex = useContext(NowPlayingContext).setPlaylistIndex
  const addToPlaylist = useContext(NowPlayingContext).addToPlaylist
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
      if(fetchSuggestedSong) {
        const res = await axios.get("http://192.168.5.217:5000/tracks")
        const tracks = res.data.tracks
        var track = tracks[(Math.floor(tracks.length * Math.random()))]
        var currentTrackResource = `${track.artist}-${track.title}`.replaceAll(" ", "_")
        while(currentTrackResource === playlist[playlistIndex].resource) {
          track = tracks[(Math.floor(tracks.length * Math.random()))]
          currentTrackResource = `${track.artist}-${track.title}`.replaceAll(" ", "_")
        }
        setSuggestedSong({
          context: "tracklist",
          collection: -1,
          resource: currentTrackResource
        })
        setFetchSuggestedSong(false)
        console.log('Suggested Song: ')
        console.log(currentTrackResource)
      }
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
  eventEmitter.removeAll('fetchSuggested', fetchSuggested)
  // I need to capture events when the track is loaded
  eventEmitter.on('fetchSuggested', fetchSuggested)

  useEffect(() => {
    // Check if the browser supports HLS.js
    if (Hls.isSupported()) {
      const hls = new Hls();

      // Construct the playlist URL dynamically based on the fileId
      const playlistUrl = `http://192.168.5.217:5000/audio/${bundle.resource}`;

      // Attach the HLS instance to the audio element
      hls.loadSource(playlistUrl);
      hls.attachMedia(audioRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false); // Data loaded successfully, stop loading indicator
        eventEmitter.emit('fetchSuggested')
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setError('Failed to load HLS stream');
        }
      });

      // Media
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: bundle.resource,
          artist: '',
          album: '',
          artwork: [
            //{ src: 'path-to-artwork.jpg', sizes: '512x512', type: 'image/jpeg' },
          ],
        });
        // Set up action handlers
        navigator.mediaSession.setActionHandler('play', () => {
          audioRef.current.play();
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          audioRef.current.pause();
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          console.log('Previous track');
          // Implement logic for playing the previous track
          handlePrevious();
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => {
          console.log('Next track');
          // Implement logic for playing the next track
          handleSkip()
        });
      }

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
    console.log('Song ended')
    console.log(playlist[playlistIndex].context)
    if(playlistIndex < playlist.length-1) {
      setPlaylistIndex(playlistIndex+1)
    }
    else {
      // If repeat and we are listening to a collection
      // if repeat and we repeat on a song
      // if we are in tracklist, fetch next song
      if(playlist[playlistIndex].context === "tracklist") {
        console.log('we are in tracklist, fetch next song')
        addToPlaylist(suggestedSong)
        console.log('Added:')
        console.log(suggestedSong)
        setFetchSuggestedSong(true)
        setPlaylistIndex(playlistIndex+1)
      }
      else {
        setPlaylistIndex(0)
      }
    }
  }
  const handleSkip = (event) => {
    if(playlistIndex < playlist.length-1) {
      setPlaylistIndex(playlistIndex+1)
    }
    else {
      setPlaylistIndex(playlist.length-1)
    }
  }
  
  const handlePrevious = (event) => {
    if(playlistIndex == 0) {
      setPlaylistIndex(0)
    }
    else {
      setPlaylistIndex(playlistIndex-1)
    }
  }

  return (
    <div className="audio-container">
      <div className="audio-player-controls">
        {/* Previous Button */}
        <p className="side-text" onClick={handlePrevious}>
          PREVIOUS
        </p>

        {/* Audio Player */}
        <div className="audio-player-center">
          <audio ref={audioRef} controls autoPlay onEnded={handleOnEnded}>
            <p>Your browser does not support HTML5 audio.</p>
          </audio>
        </div>

        {/* Next Button */}
        <p className="side-text" onClick={handleSkip}>
          NEXT
        </p>
      </div>
    </div>
  );
}

export default HLSPlayer;