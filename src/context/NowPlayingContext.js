// context/NowPlayingContext.js
import React, { createContext, useState } from 'react';

export const NowPlayingContext = createContext('');

export const NowPlayingProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([])
  const [suggestedSong, setSuggestedSong] = useState({})
  const [fetchSuggestedSong, setFetchSuggestedSong] = useState(true)
  const [playlistIndex, setPlaylistIndex] = useState(0)
  const [resource, setResource] = useState(playlist !== null ? playlist[playlistIndex] : '') 

  const addToPlaylist = (bundle, playNow) => {
    setPlaylist((previousPlaylist) => {
      return [...previousPlaylist, bundle]
    })
  }

  return (
    <NowPlayingContext.Provider value={{ resource, setResource, playlist, setPlaylist, addToPlaylist, playlistIndex, setPlaylistIndex, fetchSuggestedSong, setFetchSuggestedSong, suggestedSong, setSuggestedSong}}>
      {children}
    </NowPlayingContext.Provider>
  );
};
