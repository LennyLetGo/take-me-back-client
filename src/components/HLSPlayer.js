import React, { useEffect, useRef, useState, useContext } from 'react';
import Hls from 'hls.js';
import axios from 'axios';
import { CollectionsContext } from '../context/CollectionsContext';
import { NowPlayingContext } from '../context/NowPlayingContext';
import { UserContext } from '../context/userContext';
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
  const trailingHistory = useContext(NowPlayingContext).trailingHistory
  const setTrailingHistory = useContext(NowPlayingContext).setTrailingHistory
  const addToTrailingHistory = useContext(NowPlayingContext).addToTrailingHistory
  const currentCollection = useContext(CollectionsContext).currentCollection
  const removeDuplicates = useContext(NowPlayingContext).removeDuplicates
  const user = useContext(UserContext).user
  
  // This runs after a track is loaded so we realistically have forever to 
  // determine if a track has been played before i.e. not going to optimize... yet
  const isPlayedRecently = async (track) => {
    var is_played = false
    var h = 0
    while (h < trailingHistory.length) {
      // console.log(trailingHistory[h].resource)
      // console.log("EQUALS?")
      // console.log(`${track.artist}-${track.title}`.replaceAll(" ", "_"))
      if (trailingHistory[h].resource === `${track.artist}-${track.title}`.replaceAll(" ", "_")) {
        is_played = true
        break
      }
      h+=1
    }
    return is_played
  }
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }

  const fetchSuggested = async () => {
    console.log('fetchSuggested')
    // Check resource and how to fetch suggested song
    if(bundle.context === 'tracklist') {
      // fetch suggested from tracklist
      if(fetchSuggestedSong) {
        // Try getting suggested songs
        console.log(trailingHistory)
        const similiar_res = await axios.get(`http://192.168.5.217:5000/similiar_tracks/${bundle.resource}`)
        const similiar = shuffleArray(similiar_res.data.tracks)
        var suggested = null
        var is_recent = similiar.length == 0 // this whole logic here is really delicate
        var l = 0
        while(l < similiar.length) {
          suggested = similiar[l]
          is_recent = await isPlayedRecently(suggested)
          if(!is_recent) {
            break
          }
          l+=1
        }
        // Get all tracks
        if(is_recent) {
          console.log("Playing Random song")
          const res = await axios.get("http://192.168.5.217:5000/tracks")
          const tracks = shuffleArray(res.data.tracks)
          
          // DID WE PLAY ALL THE SONGS?
          if (tracks <= trailingHistory.length) {
            console.log('RESETTING HISTORY')
            setTrailingHistory([])
          }

          var suggested = tracks[0]
          var is_recent = false
          var l = 0
          while(l < tracks.length) {
            suggested = tracks[l]
            is_recent = await isPlayedRecently(suggested)
            if(!is_recent) {
              break
            }
            l+=1
          }
          var currentTrackResource = `${suggested.artist}-${suggested.title}`.replaceAll(" ", "_")
          //set suggested song
          setSuggestedSong({
            context: "tracklist",
            collection: -1,
            resource: currentTrackResource,
            artist: suggested.artist,
            title: suggested.title
          })
          addToTrailingHistory(bundle)
          setFetchSuggestedSong(false)
          console.log('Suggested Song: ')
          console.log(currentTrackResource)
        }
        else {
          console.log("Playing similiar song")
          //set suggested song
          let next_bundle ={
            context: "tracklist",
            collection: -1,
            resource: `${suggested.artist}-${suggested.title}`.replaceAll(" ", "_"),
            artist: suggested.artist,
            title: suggested.title
          } 
          setSuggestedSong(next_bundle)
          addToTrailingHistory(bundle)
          setFetchSuggestedSong(false)
          console.log('Suggested Song: ')
          console.log(`${suggested.artist}-${suggested.title}`.replaceAll(" ", "_"))
        }
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
    // removeDuplicates()
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
          title: bundle.title,
          artist: bundle.artist,
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
    // TODO Capture Stream
    logStream(playlist[playlistIndex]) // TODO... Await?
    // Get next song
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
        // Loop
        setPlaylistIndex(0)
        // 
      }
    }
  }
  const handleSkip = async (event) => {
    // Capture Stream
    logStream(playlist[playlistIndex]) // TODO... Await?

    if(playlistIndex < playlist.length-1) {
      setPlaylistIndex(playlistIndex+1)
    }
    else {
      if(fetchSuggestedSong) {
        await fetchSuggested()
        await addToPlaylist(suggestedSong)
        setFetchSuggestedSong(true)
        setPlaylistIndex(playlistIndex+1)
      }
      else if (suggestedSong.resource === bundle.resource){
        // do nothing
      }
      else {
        await addToPlaylist(suggestedSong)
        setFetchSuggestedSong(true)
        setPlaylistIndex(playlistIndex+1)
      }
    }
  }
  
  const handlePrevious = (event) => {
    // Capture stream
    logStream(playlist[playlistIndex]) // TODO... Await?
    if(playlistIndex == 0) {
      setPlaylistIndex(0)
    }
    else {
      setPlaylistIndex(playlistIndex-1)
    }
  }

  const logStream = async (bundle) => {
    // user_id, title, artist, collection_id, length
    const user_id = user?.id ?? -1
    const title = bundle.title
    const artist = bundle.artist
    const collection_id = bundle.collection
    const length = Math.floor(audioRef.current.currentTime) // This is in seconds
    //post the stream
    try {
      const res = await axios.post("http://192.168.5.217:5000/streams/add", {user_id, title, artist, collection_id, length})
      console.log("Stream Captured successfully")
    }
    catch {
      console.log("Error capturing stream")
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