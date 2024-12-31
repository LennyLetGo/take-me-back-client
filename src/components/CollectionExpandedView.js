import React, { useState, useContext } from 'react';
import axios from 'axios';

import { CollectionsContext } from '../context/CollectionsContext';
import { NowPlayingContext } from '../context/NowPlayingContext';

const CollectionExpandedView = props => {
    const collections = useContext(CollectionsContext).collections
    const setCollections = useContext(CollectionsContext).setCollections
    const currentCollection = useContext(CollectionsContext).currentCollection

    const playlist = useContext(NowPlayingContext).playlist
    const setPlaylist = useContext(NowPlayingContext).setPlaylist
    const playListIndex = useContext(NowPlayingContext).playlistIndex
    const setPlayListIndex = useContext(NowPlayingContext).setPlaylistIndex
    const addToPlaylist = useContext(NowPlayingContext).addToPlaylist

    const userId = props.userId

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
              resource: resource,
              title: currentTrack.title,
              artist: currentTrack.artist
            }) // true because we want to play now
            appendToEnd = true
          }
          else {
            if (appendToEnd) {
              console.log(`Adding ${currentTrackResource}`)
              addToPlaylist({
                context: "collection",
                collection: collectionId,
                resource: currentTrackResource,
                title: currentTrack.title,
                artist: currentTrack.artist
              }) 
            }
            else {
              earlierInPlaylistTracks.push({
                context: "collection",
                collection: collectionId,
                resource: currentTrackResource,
                title: currentTrack.title,
                artist: currentTrack.artist
              })
            }
          }
          i+=1
        }
        let j = 0
        // Add the songs we skipped at the beginning of the playlist to the end
        while(j < earlierInPlaylistTracks.length) {
          console.log(`Adding ${earlierInPlaylistTracks[j]}`)
          addToPlaylist(earlierInPlaylistTracks[j])
          j+=1
        }
        console.log(playlist)
      }
    


    return (renderCollectionView());
}

export default CollectionExpandedView