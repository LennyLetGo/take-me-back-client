import React, { createContext, useState } from 'react';
import axios from 'axios';
export const ChannelContext = createContext([]);

export const SidebarProvider = ({ children }) => {
  const [currentChannel, setCurrentChannel] = useState({});
  return (
    <ChannelContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </ChannelContext.Provider>
  );
};