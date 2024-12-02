// context/NowPlayingContext.js
import React, { createContext, useState } from 'react';

export const NowPlayingContext = createContext('');

export const NowPlayingProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([])
  const [trailingHistory, setTrailingHistory] = useState([])
  const [suggestedSong, setSuggestedSong] = useState({})
  const [fetchSuggestedSong, setFetchSuggestedSong] = useState(true)
  const [playlistIndex, setPlaylistIndex] = useState(0)
  const [resource, setResource] = useState(playlist !== null ? playlist[playlistIndex] : '') 

  const addToPlaylist = (bundle) => {
    setPlaylist((previousPlaylist) => {
      return [...previousPlaylist, bundle]
    })
  }
  
  const addToTrailingHistory = (bundle) => {
    setTrailingHistory((history) => {
      return [...history, bundle]
    })
  }
  const removeDuplicates = () => {
    const uniqueItems = playlist.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.resource === item.resource) // Check for unique `id`
    );
    setPlaylist(uniqueItems); // Update the state with unique items
  };

  return (
    <NowPlayingContext.Provider value={{ resource, setResource, playlist, setPlaylist, addToPlaylist, playlistIndex, setPlaylistIndex, fetchSuggestedSong, setFetchSuggestedSong, suggestedSong, setSuggestedSong, trailingHistory, setTrailingHistory, addToTrailingHistory, removeDuplicates}}>
      {children}
    </NowPlayingContext.Provider>
  );
};
