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
  const nowPlayingResource = useContext(NowPlayingContext).resource
  const setNowPlayingResource = useContext(NowPlayingContext).setResource
  const [loadTracks, setLoadTracks] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showAddCollection, setShowAddCollection] = useState(false)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [fetchCollections, setFetchCollections] = useState(true)
  console.log(nowPlayingResource)

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
      const response = await axios.post('http://localhost:5000/process-url', { url });
      setResponseMessage(response.data.message || 'URL processed successfully');
      setLoadTracks(!loadTracks)
    } catch (error) {
      setResponseMessage('Error processing URL');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (track) => {
    let resource = `${track.artist}-${track.title}`
    setNowPlayingResource(resource.replaceAll(' ', '_'))
  }

  const handleSignIn = async (event) => {
    event.preventDefault()
    let data = new FormData(event.target);
    let username = data.get('username')
    let password = data.get('password')
    const res = await axios.post("http://localhost:5000/login", {username, password})
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
    if(user === null) {
      return (
        <div className="left-sidebar">
          <div style={{ width: '200px', margin: 'auto', textAlign: 'center' }}>
            {/* Login Button */}
            <button onClick={() => setShowLoginForm(!showLoginForm)}>
              Login
            </button>
            
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
            
            {/* Separator */}
            <p>- or -</p>
            
            {/* Signup Button */}
            <button onClick={() => setShowSignupForm(!showSignupForm)}>
              Signup
            </button>
            
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
      )
    }
    else {
      return (
        <div className="left-sidebar">
          <div className="icon-list">
            {/* You can still access collections directly here if needed */}
              {collections.map((collection) => (
              <div key={collection.id} onClick={() => setSelectedItem(collection)}>
                <img src={collection.image} alt={collection.name} />
                <h4>{collection.name}</h4>
              </div>
            ))}
          </div>
          {/* Add Collection */}
          <button onClick={() => setShowAddCollection(!showAddCollection)}>
              Add Collection
            </button>
            
            {/* Signup Form */}
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
          <button onClick={(event)=>{
            localStorage.removeItem('user')
            setUser(null)
            setCollections([])
          }}>Signout</button>
        </div>
      )
    }
  }

  const renderCollectionView = () => {
    if(currentCollection === null) {
      return (
        <div className="right-sidebar">
            <p>Sign up to start creating collections!</p>
        </div>
      )
    }
    else {
      return (
        <div className="right-sidebar">
          {collections[currentCollection.id] ? (
            <>
              <img
                className="large-image img-fluid mb-3"
                src={collections[currentCollection.id].image}
                alt={collections[currentCollection.id].name}
              />
              <h3>{collections[currentCollection.id].name}</h3>
              <div>
                {collections[currentCollection.id].items.map((item, index) => (
                  <div onClick={(event) => handlePlay(item)}>
                    <p>{`${item.artist} - ${item.title}`}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>Select a collection from the left sidebar.</p>
          )}
        </div>
      )
    }
  }

  const fetchTracksByCollection = async (userId) => {
    try {
        // Call the API to fetch tracks
        const response = await axios.get(`http://localhost:5000/collections/${userId}`);

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
  if(fetchCollections && user !== null) {
    fetchTracksByCollection(user.id)
    setFetchCollections(false)
  }
  return (
    <div className="App">
      <div className="main-content">
        {/* Left Sidebar */}
        
        {renderCollectionsOrSignin()}

        {/* Center Content */}
        <div className="center-content">
          <h2>Add Track</h2>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <label htmlFor="url" style={{ whiteSpace: 'nowrap' }}>Enter URL:</label>
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/YourFavSong"
                required
                style={{
                  flex: 1,
                  padding: '0.5rem',
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: loading ? '#ccc' : '#007bff',
                  color: '#fff',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Processing...' : 'Process URL'}
              </button>
            </form>

            {responseMessage && (
              <div style={{ marginTop: '1rem' }}>
                <p>{responseMessage}</p>
              </div>
            )}
          </div>

          <TrackList value={loadTracks}/>
        </div>

        {/* Right Sidebar */}
        {renderCollectionView()}
      </div>

      {/* Audio Player */}
      <div className="audio-bar">
        <HLSPlayer fileId={nowPlayingResource}/>
      </div>
    </div>
  );
}

export default App;

