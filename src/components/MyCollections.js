import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';

import { CollectionsContext } from '../context/CollectionsContext';
import { NowPlayingContext } from '../context/NowPlayingContext';
import { UserContext } from '../context/userContext';

const MyCollection = props => {
    const selectedItem = useContext(CollectionsContext).currentCollection
    const setSelectedItem = useContext(CollectionsContext).setCurrentCollection

    const collections = useContext(CollectionsContext).collections
    const setCollections = useContext(CollectionsContext).setCollections
    const currentCollection = useContext(CollectionsContext).currentCollection
    const fetchTracksByCollection = useContext(CollectionsContext).fetchTracksByCollection
    
    const [showAddCollection, setShowAddCollection] = useState(false)
    const user = useContext(UserContext).user
    console.log("\n---- Rendering MyCollection -----")

    const handleAddCollection = (event) => {
        event.preventDefault()
        let data = new FormData(event.target);
        let collection_name = data.get('name')
        let is_public = data.get('is_public')
        let collection_id = collections.length
        let user_id = user.id
        let newCollection = {
            id: collections.length,
            name: collection_name,
            items: [],
            image: 'https://via.placeholder.com/100', // Placeholder image
        }
        if(collections.length === 0) {
          setCollections([newCollection])
        }else {
          setCollections([...collections, newCollection])
        }
        // Add the collection to the database... dont need to wait?
        axios.post('http://192.168.5.217:5000/collections', {collection_id, user_id, collection_name, is_public})
        setShowAddCollection(false) // ?
    }

    const renderCollectionsOrSignin = () => {
        if (user === null) {
            return (
            <div className="left-sidebar">
                <p>My Collections</p>
            </div>
            );
        } else {
            return (
            <div className="left-sidebar">
                {/* Horizontal Scroll for Collections */}
                <div
                className="icon-list"
                style={{
                    display: 'flex',
                    gap: '16px',
                    overflowX: 'auto',
                    padding: '10px 0',
                    whiteSpace: 'nowrap',
                    alignItems: 'center',
                }}
                >
                {collections.map((collection) => (
                    <div
                    key={collection.id}
                    onClick={() => setSelectedItem(collection)}
                    style={{
                        textAlign: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                        width: '120px',
                    }}
                    >
                    <img
                        src={collection.image}
                        alt={collection.name}
                        style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    />
                    <h4 style={{ marginTop: '8px', fontSize: '14px' }}>
                        {collection.name}
                    </h4>
                    </div>
                ))}
        
                {/* Add Collection Button */}
                <div
                    style={{
                    textAlign: 'center',
                    flexShrink: 0,
                    width: '120px',
                    cursor: 'pointer',
                    }}
                >
                    <button
                    onClick={() => setShowAddCollection(!showAddCollection)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                    >
                    Add Collection
                    </button>
                </div>
        
                {/* Signout Button */}
                <div
                    style={{
                    textAlign: 'center',
                    flexShrink: 0,
                    width: '120px',
                    cursor: 'pointer',
                    }}
                >
                </div>
                </div>
        
                {/* Add Collection Form */}
                {showAddCollection && (
                <div style={{ marginTop: '10px' }}>
                    <form onSubmit={(event) => handleAddCollection(event)}>
                    <div>
                        <label>
                        Collection Name:
                        <input type="text" name="name" />
                        </label>
                    </div>
                    <button type="submit">Submit</button>
                    </form>
                </div>
                )}
            </div>
            );
        }    
    }
    useEffect(()=> {
        const getCollections = async () => {
            await fetchTracksByCollection(user?.username)
            console.log(collections)
        }
        getCollections()
    }, [user])
    
    return (renderCollectionsOrSignin())
}

export default MyCollection