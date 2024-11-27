import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Placeholder collection items
  const collections = [
    {
      id: 1,
      name: 'Collection 1',
      items: ['Item 1', 'Item 2', 'Item 3'],
      image: 'https://via.placeholder.com/100' // Placeholder image
    },
    {
      id: 2,
      name: 'Collection 2',
      items: ['Item A', 'Item B'],
      image: 'https://via.placeholder.com/100/0000FF' // Another placeholder image
    }
  ];

  return (
    <div className="App">
      <div className='d-flex justify-content-between' style={{height:'100%'}}>
        <div className='row justify-content-between'>
          <div className='col-2 p-3'>
            <div className="left-sidebar">
              <div className="icon-list">
                {collections.map((collection) => (
                  <div key={collection.id} className="icon-item" onClick={() => setSelectedItem(collection)}>
                    <img src={collection.image} alt={`Collection ${collection.id}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='col-8 p-3 d-flex align-items-center justify-content-center'>  
            <div className="center-content">
              <h2>Insert suggestions</h2>
            </div>
          </div>
          <div className='col-2 p-3'>
            <div className="right-sidebar">
              {selectedItem ? (
                <>
                  <img className="large-image" src={selectedItem.image} alt={selectedItem.name} />
                  <h3>{selectedItem.name}</h3>
                  <ul>
                    {selectedItem.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Select a collection from the left sidebar.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="audio-bar">
        <audio controls>
          {/* No audio source yet */}
        </audio>
      </div>
    </div>
  );
}

export default App;

