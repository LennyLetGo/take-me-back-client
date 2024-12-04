// context/CollectionsContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';
export const SidebarContext = createContext([]);

export const SidebarProvider = ({ children }) => {
  const [currentTab, setCurrentTab] = useState('home');
  return (
    <SidebarContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </SidebarContext.Provider>
  );
};