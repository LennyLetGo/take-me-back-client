// context/CollectionsContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';
export const CollectionsContext = createContext([]);

export const CollectionsProvider = ({ children }) => {
  const [collections, setCollections] = useState([]);
  const [currentCollection, setCurrentCollection] = useState(null)
  const addTrackToCollection = async (collection_id, username, title, artist, track) => {
    setCollections((prevCollections) => {
      return prevCollections.map((collection, index) =>{
          if(collection.id === collection_id) {
            if(collection.items.length === 1 && collection.items[0].artist === null) {
              return {
                id: index,
                name: collection.name,
                items: [track],
                image: 'https://via.placeholder.com/100', // Placeholder image
              }
            }
            else {
              return { ...collection, items: [...collection.items, track] }
            }
          }
          else {
            return collection
          }
      });
    });
    const res = await axios.post("http://192.168.5.217:5000/collection/insert", { collection_id, username, title, artist  })
  };
  const fetchTracksByCollection = async (username) => {
    try {
        console.log('Fetching collections')
        // Call the API to fetch tracks
        const response = await axios.get(`http://192.168.5.217:5000/collection/${username}`);

        if (response.status !== 200) {
            throw new Error('Failed to fetch tracks.');
        }

        const tracks = response.data.tracks;

        // Group tracks by collection name and structure the data
        const groupedCollections = Object.values(
            tracks.reduce((acc, track) => {
                const { collection_id, username, collection_name, is_public, title, artist, path, collection_insert_dt, release_dt } = track;

                if (!acc[collection_name]) {
                    acc[collection_name] = {
                        id: Object.keys(acc).length,
                        name: collection_name,
                        items: [],
                        image: 'https://via.placeholder.com/100', // Placeholder image
                    };
                }
                if(artist !== null && title !== null) {
                  acc[collection_name].items.push({
                    artist: artist,
                    title: title
                  });
                }
                return acc;
            }, {})
        );

        setCollections((previous) => {return groupedCollections})
      } catch (error) {
          console.error('Error fetching tracks:', error);
          throw error;
      }
  };
  
  return (
    <CollectionsContext.Provider value={{ collections, setCollections, addTrackToCollection, currentCollection, setCurrentCollection, fetchTracksByCollection }}>
      {children}
    </CollectionsContext.Provider>
  );
};
