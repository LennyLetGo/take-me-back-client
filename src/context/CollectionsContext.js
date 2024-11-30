// context/CollectionsContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';
export const CollectionsContext = createContext([]);

export const CollectionsProvider = ({ children }) => {
  const [collections, setCollections] = useState([]);
  const [currentCollection, setCurrentCollection] = useState(null)
  const addTrackToCollection = async (collectionId, name, track, user_id, title, artist) => {
    setCollections((prevCollections) => {
      return prevCollections.map((collection) =>
        collection.id === collectionId
          ? { ...collection, items: [...collection.items, track] }
          : collection
      );
    });
    const res = await axios.post("http://192.168.5.217:5000/collections/add", { user_id, title, artist, name })
  };
  return (
    <CollectionsContext.Provider value={{ collections, setCollections, addTrackToCollection, currentCollection, setCurrentCollection }}>
      {children}
    </CollectionsContext.Provider>
  );
};
