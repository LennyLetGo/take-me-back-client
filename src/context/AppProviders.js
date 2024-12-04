import React from 'react';
import { CollectionsProvider } from './CollectionsContext'
import { NowPlayingProvider } from './NowPlayingContext';
import { SidebarProvider } from './SidebarContext';

const AppProviders = ({ children }) => {
  return (
    <NowPlayingProvider>
        <CollectionsProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </CollectionsProvider>
    </NowPlayingProvider>
  );
};

export default AppProviders;
