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
  const playlist = useContext(NowPlayingContext).playlist
  const playListIndex = useContext(NowPlayingContext).playlistIndex
  const setPlaylistIndex = useContext(NowPlayingContext).setPlaylistIndex
  const addToPlaylist = useContext(NowPlayingContext).addToPlaylist

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tracks');
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
    addTrackToCollection(collectionId, currentCollection.name, track, user.id, track.title, track.artist); // Add track to selected collection
  };
  const handlePlay = (track) => {
    let resource = `${track.artist.replaceAll(' ', '_')}-${track.title.replaceAll(' ', '_')}`
    let bundle = {
      context: "tracklist",
      collection: -1,
      resource: resource
    }
    console.log('Setting now playing:')
    console.log(bundle)
    addToPlaylist(bundle)
    setPlaylistIndex(playlist.length)
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
              {`${track.artist} - ${track.title}`}
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
