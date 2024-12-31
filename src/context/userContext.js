// context/CollectionsContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';
export const UserContext = createContext([]);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const userLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }
  return (
    <UserContext.Provider value={{ user, setUser, userLogout }}>
      {children}
    </UserContext.Provider>
  );
};