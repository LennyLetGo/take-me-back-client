import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';

import { CollectionsContext } from '../context/CollectionsContext';
import { NowPlayingContext } from '../context/NowPlayingContext';

const MyCollection = props => {
    const selectedItem = useContext(CollectionsContext).currentCollection
    const setSelectedItem = useContext(CollectionsContext).setCurrentCollection

    const collections = useContext(CollectionsContext).collections
    const setCollections = useContext(CollectionsContext).setCollections
    const currentCollection = useContext(CollectionsContext).currentCollection
    
    const [showAddCollection, setShowAddCollection] = useState(false)

    const user = props.user

    const handleAddCollection = (event) => {
        event.preventDefault()
        let data = new FormData(event.target);
        let name = data.get('name')
        let newCollection = {
            id: collections.length,
            name: name,
            items: [],
            image: 'https://via.placeholder.com/100', // Placeholder image
        }
        console.log(collections)
        if(collections.length === 0) {
          setCollections([newCollection])
        }else {
          setCollections([...collections, newCollection])
        }
        setShowAddCollection(false)
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
        const fetchTracksByCollection = async (userId) => {
            try {
                // Call the API to fetch tracks
                const response = await axios.get(`http://192.168.5.217:5000/collections/${userId}`);
        
                if (response.status !== 200) {
                    throw new Error('Failed to fetch tracks.');
                }
        
                const tracks = response.data.tracks;
        
                // Group tracks by collection name and structure the data
                const groupedCollections = Object.values(
                    tracks.reduce((acc, track) => {
                        const { name, title, artist } = track;
        
                        if (!acc[name]) {
                            acc[name] = {
                                id: Object.keys(acc).length,
                                name,
                                items: [],
                                image: 'https://via.placeholder.com/100', // Placeholder image
                            };
                        }
        
                        acc[name].items.push({
                          artist: artist,
                          title: title
                        });
                        return acc;
                    }, {})
                );
        
                setCollections(groupedCollections)
            } catch (error) {
                console.error('Error fetching tracks:', error);
                throw error;
            }
        };
        fetchTracksByCollection(user?.id)
    }, [user])
    
    return (renderCollectionsOrSignin())
}

export default MyCollection