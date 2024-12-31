// components/TrackList.js
import React, { useEffect, useState, useContext } from 'react';
import './TrackList.css';
import axios from 'axios';
import { CollectionsContext } from '../context/CollectionsContext'; // Import context
import { NowPlayingContext } from '../context/NowPlayingContext';
import { UserContext } from '../context/userContext';

import MyCollection from './MyCollections';

function TrackList(props) {
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [filter, setFilter] = useState('');
  const addTrackToCollection = useContext(CollectionsContext).addTrackToCollection; // Use context
  const currentCollection = useContext(CollectionsContext).currentCollection;
  const playlist = useContext(NowPlayingContext).playlist
  const playListIndex = useContext(NowPlayingContext).playlistIndex
  const setPlaylistIndex = useContext(NowPlayingContext).setPlaylistIndex
  const addToPlaylist = useContext(NowPlayingContext).addToPlaylist
  const user = useContext(UserContext).user
  console.log('\n--- Tracklist Rendering ---')

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.get('http://ec2-3-128-188-22.us-east-2.compute.amazonaws.com:5000/tracks');
        setTracks(response.data.tracks);
        setFilteredTracks(response.data.tracks);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    };

    fetchTracks();
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);

    const filtered = tracks.filter(track =>
      `${track.artist.toLowerCase()}-${track.title.toLowerCase()}`.includes(value.toLowerCase())
    );
    setFilteredTracks(filtered);
  };

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
      <MyCollection user={user}/>
      <h4>Search</h4>
      <input
        type="text"
        value={filter}
        onChange={handleFilterChange}
        placeholder="Search for a track..."
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '10px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <div
        className="tracklist"
        style={{
          overflowY: 'auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px', // Gap between tracks
        }}
      >
        {filteredTracks.length === 0 ? (
          <p>No tracks found</p>
        ) : (
          filteredTracks.map((track, index) => (
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
        )}
      </div>
    </div>
  );
}

export default TrackList;
