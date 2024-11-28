// components/TrackList.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CollectionsContext } from '../context/CollectionsContext'; // Import context
import { NowPlayingContext } from '../context/NowPlayingContext';

function TrackList(props) {
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [filter, setFilter] = useState('');
  const addTrackToCollection = useContext(CollectionsContext).addTrackToCollection; // Use context
  const currentCollection = useContext(CollectionsContext).currentCollection;
  const nowPlayingResource = useContext(NowPlayingContext).resource
  const setNowPlayingResource = useContext(NowPlayingContext).setResource

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tracks');
        setTracks(response.data);
        setFilteredTracks(response.data);
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
      track.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTracks(filtered);
  };

  const handleAddTrackToCollection = (collectionId, track) => {
    addTrackToCollection(collectionId, track); // Add track to selected collection
  };
  const handlePlay = (track) => {
    setNowPlayingResource(track.replaceAll(' ', '_'))
  }

  return (
    <div>
      <h3>Track List</h3>
      <input
        type="text"
        value={filter}
        onChange={handleFilterChange}
        placeholder="Search for a track..."
      />
      <div>
        {filteredTracks.length === 0 ? (
          <p>No tracks found</p>
        ) : (
          filteredTracks.map((track, index) => (
            <div key={index}>
              {track}
              <button onClick={() => handleAddTrackToCollection(currentCollection.id, track)}>
                Add to Current Collection
              </button>
              <button onClick={() => handlePlay(track)}>
                Play
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TrackList;
