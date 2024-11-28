// context/CollectionsContext.js
import React, { createContext, useState } from 'react';

export const CollectionsContext = createContext([]);

export const CollectionsProvider = ({ children }) => {
  const [collections, setCollections] = useState([
    {
      id: 0,
      name: 'Collection 1',
      items: ['Item 1', 'Item 2', 'Item 3'],
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 1,
      name: 'Collection 2',
      items: ['Item A', 'Item B'],
      image: 'https://via.placeholder.com/100/0000FF',
    },
  ]);
  const [currentCollection, setCurrentCollection] = useState(null)

  const addTrackToCollection = (collectionId, track) => {
    setCollections((prevCollections) => {
      return prevCollections.map((collection) =>
        collection.id === collectionId
          ? { ...collection, items: [...collection.items, track] }
          : collection
      );
    });
  };

  return (
    <CollectionsContext.Provider value={{ collections, addTrackToCollection, currentCollection, setCurrentCollection }}>
      {children}
    </CollectionsContext.Provider>
  );
};
