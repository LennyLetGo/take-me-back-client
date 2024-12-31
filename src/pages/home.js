import React, { useEffect, useContext } from 'react';

import Sidebar from '../components/Sidebar';
import TrackList from '../components/TrackList';
import HLSPlayer from '../components/HLSPlayer';
import HomeComponent from '../components/HomeComponent';
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import Radio from '../components/Radio';

import { CollectionsContext } from '../context/CollectionsContext';
import { NowPlayingContext } from '../context/NowPlayingContext';
import { SidebarContext } from '../context/SidebarContext';
import { UserContext } from '../context/userContext';
import { ChannelContext } from '../context/ChannelContext';

const Home = () => {
    const currentTab = useContext(SidebarContext).currentTab // Default is 'home'
    const setCurrentTab = useContext(SidebarContext).setCurrentTab
    console.log('\n--RERENDERING HOME--')
    console.log(`Current Tab: ${currentTab}`)

    const playlist = useContext(NowPlayingContext).playlist
    const setPlaylist = useContext(NowPlayingContext).setPlaylist
    const playListIndex = useContext(NowPlayingContext).playlistIndex
    const setPlayListIndex = useContext(NowPlayingContext).setPlaylistIndex
    const addToPlaylist = useContext(NowPlayingContext).addToPlaylist
    
    const user = useContext(UserContext).user
    useEffect(() => {
        // Force this page to rerender when user changes
    }, [user])

    // Load in the first channel by default
    const setCurrentChannel = useContext(ChannelContext).setCurrentChannel
    useEffect(() => {

    }, [])

    const renderPage = () => {
        console.log('Render Page...')
        if(currentTab==='explore-all-tracks') {
            console.log('returning TrackList')
            return (<TrackList/>)
        }
        else if(currentTab==='home') {
            return (<HomeComponent user={user}/>)
        }
        else if(currentTab === 'profile-login') {
            return (<Login/>)
        }
        else if(currentTab === 'profile-signup') {
            return (<SignUp/>)
        }
        else if(currentTab === 'explore-channels') {
            return (<Radio/>)
        }
    }

    return (
        <div style={styles.container}>
            <Sidebar user={user}/>
            <div style={styles.content}>
                {renderPage()}
                {/* HLS Player */}
                <div style={styles.audioBar}>
                    <HLSPlayer
                        bundle={
                        playlist.length !== 0
                            ? playlist[playListIndex]
                            : { context: "NA", collection: -1, resource: "" }
                        }
                    />
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',       // Enables flexbox layout
        flexDirection: 'row',  // Aligns items horizontally
        height: '100vh',       // Full viewport height
    },
    content: {
        flex: 1,               // Takes up remaining space
        padding: '20px',       // Adds padding around content
        overflowY: 'auto',     // Allows scrolling if content overflows
    },
    /* Ensure the audio bar is fixed at the bottom */
    audioBar: {
    position: "fixed", /* Fixes the audio player at the bottom of the screen */
    bottom: 0,
    left: 0,
    width: "100%",
    height: "7vh",
    backgroundColor: "#fff", /* Optional: background color to separate it visually */
    boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.2)", /* Optional: shadow for a floating effect */
    zIndex: '1000', /* Ensures the audio player stays on top of other content */
    boxSizing: "border-box", /* Ensures padding does not affect layout width */
  }
}

export default Home;
