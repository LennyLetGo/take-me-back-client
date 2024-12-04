import React, { useContext, useState } from 'react';

import { SidebarContext } from '../context/SidebarContext';

const Sidebar = props => {
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleExplore = () => setIsExploreOpen(!isExploreOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const currentTab = useContext(SidebarContext).currentTab // Default is 'home'
  const setCurrentTab = useContext(SidebarContext).setCurrentTab

  const user = props.user

  const renderUserLogin = () => {
    if(user === null) {
        return (
            <div style={profileContainerStyle}>
              <div style={profileStyle} onClick={toggleProfile}>
                Login/Signup
              </div>
              {isProfileOpen && (
                <div style={profileOptionsStyle}>
                  <p onClick={(event) => {
                      setCurrentTab('profile-login')
                  }}>Login</p>
                  <p onClick={(event) => {
                      setCurrentTab('profile-signup')
                  }}>Signup</p>
                </div>
              )}
            </div>
        )
    }
    else {
        return (
            <div style={profileContainerStyle}>
              <div style={profileStyle} onClick={toggleProfile}>
                {user.username}
              </div>
              {isProfileOpen && (
                <div style={profileOptionsStyle}>
                  <p onClick={(event) => {
                      setCurrentTab('profile-profile')
                  }}>Profile</p>
                  <p onClick={(event) => {
                      setCurrentTab('profile-setting')
                  }}>Settings</p>
                  <p onClick={(event) => {
                      setCurrentTab('profile-logout')
                  }}>Logout</p>
                </div>
              )}
            </div>
        )
    }
  }
  
  return (
    <div style={sidebarStyle}>
      <div>
        {/* Logo and Title */}
        <div style={logoStyle}>
          <img
            src="https://via.placeholder.com/100"
            alt="Logo"
            style={{ width: '100px', borderRadius: '50%' }}
          />
          <h2>Take Me Back</h2>
        </div>

        {/* Navigation */}
        <ul style={navStyle}>
          <li style={navItemStyle} onClick={(event)=> {
            setCurrentTab('home')
          }}>Home</li>
          <li style={navItemStyle} onClick={toggleExplore}>
            Explore
          </li>
          {isExploreOpen && (
            <ul style={dropdownStyle}>
              <li style={navItemStyle} onClick={(event) => {
                setCurrentTab('explore-all-tracks')
              }}>All Tracks</li>
              <li style={navItemStyle} onClick={(event) => {
                setCurrentTab('explore-2')
              }}>Option 2</li>
              <li style={navItemStyle} onClick={(event) => {
                setCurrentTab('explore-3')
              }}>Option 3</li>
            </ul>
          )}
          <li style={navItemStyle} onClick={(event) => {
                setCurrentTab('request')
              }}>Request</li>
        </ul>
      </div>

      {/* Profile Section */}
      {renderUserLogin()}
    </div>
  );
};
// Styles
const sidebarStyle = {
display: 'flex',
flexDirection: 'column',
justifyContent: 'space-between',
height: '93vh', // Dependent on height of HLSPLAYER
width: '250px',
backgroundColor: '#1a1a2e',
color: '#fff',
padding: '20px',
boxSizing: 'border-box',
};

const logoStyle = {
textAlign: 'center',
marginBottom: '20px',
};

const navStyle = {
listStyleType: 'none',
padding: '0',
};

const navItemStyle = {
padding: '10px 15px',
cursor: 'pointer',
borderRadius: '5px',
marginBottom: '10px',
backgroundColor: '#16213e',
textAlign: 'left',
};

const dropdownStyle = {
paddingLeft: '20px',
};

const profileStyle = {
textAlign: 'center',
alignItems: 'center',
cursor: 'pointer',
backgroundColor: '#16213e',
padding: '10px',
// borderRadius: '50%',
width: '100%',
height: '50px',
margin: '0 auto',
};

const profileOptionsStyle = {
marginTop: '10px',
textAlign: 'center',
};

const profileContainerStyle = {
// display: "flex",
alignItems: "center",
cursor: "pointer",
};


export default Sidebar;
