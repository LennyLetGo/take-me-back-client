// context/NowPlayingContext.js
import React, { createContext, useState } from 'react';

export const NowPlayingContext = createContext('');

export const NowPlayingProvider = ({ children }) => {
  const [resource, setResource] = useState('') 

  return (
    <NowPlayingContext.Provider value={{ resource, setResource }}>
      {children}
    </NowPlayingContext.Provider>
  );
};
