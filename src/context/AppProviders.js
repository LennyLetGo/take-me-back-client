import React from 'react';
import { CollectionsProvider } from './CollectionsContext'
import { NowPlayingProvider } from './NowPlayingContext';

const AppProviders = ({ children }) => {
  return (
    <NowPlayingProvider>
        <CollectionsProvider>
            {children}
        </CollectionsProvider>
    </NowPlayingProvider>
  );
};

export default AppProviders;
