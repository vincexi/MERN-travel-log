import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { listLogEntries } from './API'

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.6,
    longitude: -95.665,
    zoom: 3
  });

  useEffect(() => {
    (async () => {
      const logEntries = await listLogEntries();
      setLogEntries(logEntries);
    })();
  }, []);

  return (
    <ReactMapGL
      {...viewport}
      mapStyle='mapbox://styles/vincexi/ckaue3qlg2kan1il8nasxcnas'
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={nextViewport => setViewport(nextViewport)}
    >
      {
        logEntries.map(entry => (
          <React.Fragment key={entry._id}>
            <Marker 
              key={entry._id}
              latitude={entry.latitude}
              longitude={entry.longitude}
              offsetLeft={-12}
              offsetTop={-24}>
              <div onClick={() => setShowPopup({
                ...showPopup,
                [entry._id]: true,
              })}>
              <svg
                className="marker" width="24" height="24" viewBox="0 0 24 24" stroke="orange" strokeWidth="2.5" fill="yellow" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              </div>
            </Marker>
            {
              showPopup[entry._id] ? (
                <Popup
                  latitude={entry.latitude}
                  longitude={entry.longitude}
                  closeButton={true}
                  closeOnClick={true}
                  onClose={() => setShowPopup({ 
                    ...showPopup,
                    [entry._id] : false,
                  })}
                  anchor="top" > 
                  <div className="popup">
                    <h3>{entry.title}</h3> 
                    <p>{entry.description}</p> 
                  </div>
                  </Popup>) : null
            }
          </React.Fragment>
        ))
      }
    </ReactMapGL>
  );
}

export default App;
