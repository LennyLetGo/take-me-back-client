// components/TrackList.js
import React, { useEffect, useState, useContext } from 'react';
import './TrackList.css';
import axios from 'axios';
import { CollectionsContext } from '../context/CollectionsContext'; // Import context
import { NowPlayingContext } from '../context/NowPlayingContext';
import { UserContext } from '../context/userContext';

import MyCollection from './MyCollections';

function TrackList(props) {
  const addTrackToCollection = useContext(CollectionsContext).addTrackToCollection; // Use context
  const currentCollection = useContext(CollectionsContext).currentCollection;
  const playlist = useContext(NowPlayingContext).playlist
  const setPlaylistIndex = useContext(NowPlayingContext).setPlaylistIndex
  const addToPlaylist = useContext(NowPlayingContext).addToPlaylist
  console.log('\n--- Tracklist Rendering ---')

  const handleAddTrackToCollection = (collectionId, track) => {
    //collectionId, name, track, userId, title, artist
    let user = JSON.parse(localStorage.getItem('user'))
    console.log(user.id)
    addTrackToCollection(collectionId, user.username, track.title, track.artist, track); // Add track to selected collection
  };
  const handlePlay = (track) => {
    let resource = `${track.artist.replaceAll(' ', '_')}-${track.title.replaceAll(' ', '_')}`
    let bundle = {
      context: "tracklist",
      collection: -1,
      resource: resource,
      title: track.title,
      artist: track.artist
    }
    console.log('Setting now playing:')
    console.log(bundle)
    addToPlaylist(bundle)
    setPlaylistIndex(playlist.length) // This could be causing a rerender everytime the song changes?.. Add "incrementPlaylistIndex" function in context?
  }
  const buttonStyle = {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff', // Blue color for the button
    color: 'white',
    cursor: 'pointer',
  };
  return (
    <div style={{ maxHeight: '100%', padding: '10px', paddingBottom:'10vh' }}>
      <div
        className="tracklist"
        style={{
          overflowY: 'auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px', // Gap between tracks
        }}
      >{
          props.tracks.map((track, index) => (
            <div
              key={index}
              className="track-item"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px', // Gap between the track details and buttons
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {`${track.artist} - ${track.title}`}
              </span>
              <div className="track-buttons" style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleAddTrackToCollection(currentCollection.id, track)}
                  style={buttonStyle}
                  disabled={(currentCollection===null)}
                  display={!(currentCollection===null)}
                >
                  {(currentCollection===null) ? "Please select a Collection":`Add to "${currentCollection?.name}"`}
                </button>
                <button
                  onClick={() => handlePlay(track)}
                  style={buttonStyle}
                >
                  Play
                </button>
              </div>
            </div>
          ))
      }
      </div>
    </div>
  );
}

export default TrackList;
