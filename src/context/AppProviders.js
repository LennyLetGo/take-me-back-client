import React from 'react';
import { CollectionsProvider } from './CollectionsContext'
import { NowPlayingProvider } from './NowPlayingContext';
import { SidebarProvider } from './SidebarContext';
import { UserProvider } from './userContext';

const AppProviders = ({ children }) => {
  return (
    <NowPlayingProvider>
      <UserProvider>
        <CollectionsProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </CollectionsProvider>
      </UserProvider>
    </NowPlayingProvider>
  );
};

export default AppProviders;
