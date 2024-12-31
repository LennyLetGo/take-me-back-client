import React from "react";

const RadioChannelCarosel = props => {
    return (
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
    );
}