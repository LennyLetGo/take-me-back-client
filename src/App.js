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
  const currentCollection = useContext(CollectionsContext).currentCollection
  const nowPlayingResource = useContext(NowPlayingContext).resource
  const setNowPlayingResource = useContext(NowPlayingContext).setResource
  const [loadTracks, setLoadTracks] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [user, setUser] = useState(localStorage.getItem('user'))
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
    setNowPlayingResource(track.replaceAll(' ', '_'))
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
                <form>
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
                <form>
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
          <button onClick={(event)=>{}}>Add new Collection</button>
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
                    <p>{item}</p>
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

