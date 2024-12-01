// src/App.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import TrackList from './components/TrackList';
import HLSPlayer from './components/HLSPlayer';

import { CollectionsContext } from './context/CollectionsContext';
import { NowPlayingContext } from './context/NowPlayingContext';

function App() {
  const [url, setUrl] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const selectedItem = useContext(CollectionsContext).currentCollection
  const setSelectedItem = useContext(CollectionsContext).setCurrentCollection
  const collections = useContext(CollectionsContext).collections
  const setCollections = useContext(CollectionsContext).setCollections
  const currentCollection = useContext(CollectionsContext).currentCollection
  const playlist = useContext(NowPlayingContext).playlist
  const setPlaylist = useContext(NowPlayingContext).setPlaylist
  const playListIndex = useContext(NowPlayingContext).playlistIndex
  const setPlayListIndex = useContext(NowPlayingContext).setPlaylistIndex
  const addToPlaylist = useContext(NowPlayingContext).addToPlaylist
  const [loadTracks, setLoadTracks] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showAddCollection, setShowAddCollection] = useState(false)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [fetchCollections, setFetchCollections] = useState(true)

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      setResponseMessage('Please enter a URL');
      return;
    }

    setLoading(true);
    setResponseMessage('');

    try {
      const response = await axios.post('http://192.168.5.217:5000/process-url', { url });
      setResponseMessage(response.data.message || 'URL processed successfully');
      setLoadTracks(!loadTracks)
    } catch (error) {
      setResponseMessage('Error processing URL');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (collectionId, track) => {
    let resource = `${track.artist}-${track.title}`.replaceAll(' ', '_')
    // New collection.... reset the playlist
    if(playlist.length > 0 && playlist[playListIndex].collectionId !== collectionId) {
      setPlaylist([])
      setPlayListIndex(0)
    }
    console.log('Target Track')
    console.log(resource)
    // Loop through and add all songs to playlist
    let tracks = collections[collectionId].items
    console.log('Current Collection Tracks')
    console.log(tracks)
    let earlierInPlaylistTracks = []
    let appendToEnd = false
    let i = 0
    while(i < tracks.length) {
      let currentTrack = tracks[i]
      let currentTrackResource = `${currentTrack.artist}-${currentTrack.title}`.replaceAll(" ", "_")
      if (resource === currentTrackResource) {
        console.log(`Adding: ${resource}`)
        // We found the current song, so now just add until we reached end of list
        addToPlaylist({
          context: "collection",
          collection: collectionId,
          resource: resource
        }) // true because we want to play now
        appendToEnd = true
      }
      else {
        if (appendToEnd) {
          console.log(`Adding ${currentTrackResource}`)
          addToPlaylist({
            context: "collection",
            collection: collectionId,
            resource: currentTrackResource
          }) 
        }
        else {
          earlierInPlaylistTracks.push(currentTrackResource)
        }
      }
      i+=1
    }
    let j = 0
    // Add the songs we skipped at the beginning of the playlist to the end
    while(j < earlierInPlaylistTracks.length) {
      console.log(`Adding ${earlierInPlaylistTracks[j]}`)
      addToPlaylist({
        context: "collection",
        collection: collectionId,
        resource: earlierInPlaylistTracks[j]
      })
      j+=1
    }
    console.log(playlist)
  }

  const handleSignIn = async (event) => {
    event.preventDefault()
    let data = new FormData(event.target);
    let username = data.get('username')
    let password = data.get('password')
    const res = await axios.post("http://192.168.5.217:5000/login", {username, password})
    let user = res.data.user
    if(user) {
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      fetchTracksByCollection(user.id)
    }
    else {
      alert("Invalid username or password")
    }
  }

  const handleSignUp = async (event) => {
    event.preventDefault()
    let data = new FormData(event.target);
    let username = data.get('username')
    let password = data.get('password')
    const res = await axios.post("http://localhost:5000/create-user", {username, password})
    let user = res.data.user
    if(user) {
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      fetchTracksByCollection(user.id)
    }
    else {
      alert("Server Error")
    }
  }

  const handleAddCollection = (event) => {
    event.preventDefault()
    let data = new FormData(event.target);
    let name = data.get('name')
    let newCollection = {
        id: collections.length,
        name: name,
        items: [],
        image: 'https://via.placeholder.com/100', // Placeholder image
    }
    console.log(collections)
    if(collections.length === 0) {
      setCollections([newCollection])
    }else {
      setCollections([...collections, newCollection])
    }
    setShowAddCollection(false)
  }

  const renderCollectionsOrSignin = () => {
    if (user === null) {
      return (
        <div className="left-sidebar">
          <div style={{ width: '200px', margin: 'auto', textAlign: 'center' }}>
            {/* Horizontal Button Layout */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
              {/* Login Button */}
              <button onClick={() => setShowLoginForm(!showLoginForm)}>Login</button>
    
              {/* Signup Button */}
              <button onClick={() => setShowSignupForm(!showSignupForm)}>Signup</button>
            </div>
    
            {/* Login Form */}
            {showLoginForm && (
              <div style={{ marginTop: '10px' }}>
                <form onSubmit={(event) => handleSignIn(event)}>
                  <div>
                    <label>
                      Username:
                      <input type="text" name="username" />
                    </label>
                  </div>
                  <div>
                    <label>
                      Password:
                      <input type="password" name="password" />
                    </label>
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </div>
            )}
    
            {/* Signup Form */}
            {showSignupForm && (
              <div style={{ marginTop: '10px' }}>
                <form onSubmit={(event) => handleSignUp(event)}>
                  <div>
                    <label>
                      Username:
                      <input type="text" name="username" />
                    </label>
                  </div>
                  <div>
                    <label>
                      Password:
                      <input type="password" name="password" />
                    </label>
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="left-sidebar">
          {/* Horizontal Scroll for Collections */}
          <div
            className="icon-list"
            style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              padding: '10px 0',
              whiteSpace: 'nowrap',
              alignItems: 'center',
            }}
          >
            {collections.map((collection) => (
              <div
                key={collection.id}
                onClick={() => setSelectedItem(collection)}
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  width: '120px',
                }}
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <h4 style={{ marginTop: '8px', fontSize: '14px' }}>
                  {collection.name}
                </h4>
              </div>
            ))}
    
            {/* Add Collection Button */}
            <div
              style={{
                textAlign: 'center',
                flexShrink: 0,
                width: '120px',
                cursor: 'pointer',
              }}
            >
              <button
                onClick={() => setShowAddCollection(!showAddCollection)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Add Collection
              </button>
            </div>
    
            {/* Signout Button */}
            <div
              style={{
                textAlign: 'center',
                flexShrink: 0,
                width: '120px',
                cursor: 'pointer',
              }}
            >
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  setUser(null);
                  setCollections([]);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Signout
              </button>
            </div>
          </div>
    
          {/* Add Collection Form */}
          {showAddCollection && (
            <div style={{ marginTop: '10px' }}>
              <form onSubmit={(event) => handleAddCollection(event)}>
                <div>
                  <label>
                    Collection Name:
                    <input type="text" name="name" />
                  </label>
                </div>
                <button type="submit">Submit</button>
              </form>
            </div>
          )}
        </div>
      );
    }    
  }

  const renderCollectionView = () => {
    if (currentCollection === null) {
      return (
        <div className="right-sidebar">
          <p>Sign up to start creating collections!</p>
        </div>
      );
    } else {
      return (
        <div className="right-sidebar">
          {collections[currentCollection.id] ? (
            <>
              <img
                className="large-image img-fluid mb-3"
                src={collections[currentCollection.id].image}
                alt={collections[currentCollection.id].name}
                style={{ width: '100%', maxWidth: '300px', height: 'auto' }} // Ensure the image is responsive
              />
              <h3>{collections[currentCollection.id].name}</h3>
    
              {/* Vertical Scrollable Track List */}
              <div
                className="collection-items"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxHeight: '300px', // Set a maximum height for the list
                  overflowY: 'auto', // Enable vertical scrolling
                  padding: '10px 0',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                {collections[currentCollection.id].items.map((item, index) => (
                  <div
                    key={index}
                    onClick={(event) => handlePlay(currentCollection.id, item)}
                    style={{
                      padding: '10px',
                      borderBottom: '1px solid #eee', // Add a subtle separator between items
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#f1f1f1')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <p style={{ margin: 0 }}>{`${item.artist} - ${item.title}`}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>Select a collection from the left sidebar.</p>
          )}
        </div>
      );
    }
  }

  const fetchTracksByCollection = async (userId) => {
    try {
        // Call the API to fetch tracks
        const response = await axios.get(`http://192.168.5.217:5000/collections/${userId}`);

        if (response.status !== 200) {
            throw new Error('Failed to fetch tracks.');
        }

        const tracks = response.data.tracks;

        // Group tracks by collection name and structure the data
        const groupedCollections = Object.values(
            tracks.reduce((acc, track) => {
                const { name, title, artist } = track;

                if (!acc[name]) {
                    acc[name] = {
                        id: Object.keys(acc).length,
                        name,
                        items: [],
                        image: 'https://via.placeholder.com/100', // Placeholder image
                    };
                }

                acc[name].items.push({
                  artist: artist,
                  title: title
                });
                return acc;
            }, {})
        );

        setCollections(groupedCollections)
    } catch (error) {
        console.error('Error fetching tracks:', error);
        throw error;
    }
};

return (
  <div className="App">
    {/* Sign-in/Login Section */}
    <div className="signin-section">
      {renderCollectionsOrSignin()} {/* Assuming this renders the sign-in and login options */}
    </div>

    {/* Collections Section */}
    <div className="collections-section">
      <h2>Collections</h2>
      <div className="collections-scroll-container">
        {renderCollectionView()} {/* Assuming this renders collection items */}
      </div>
    </div>

    {/* Tracklist Section */}
    <div className="tracklist-section">
      <h2>Track List</h2>
      <div className="track-list-container">
        <TrackList value={loadTracks} />
      </div>
    </div>

    {/* HLS Player */}
    <div className="audio-bar">
      <HLSPlayer
        bundle={
          playlist.length !== 0
            ? playlist[playListIndex]
            : { context: "NA", collection: -1, resource: "" }
        }
      />
    </div>
  </div>
);
};

export default App;

