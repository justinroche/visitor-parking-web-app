import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import './App.css';
import Button from 'react-bootstrap/Button';
import ParkingInformation from './ParkingInformation';


function App() {
  /* State */
 
  const [showParkingInformation, setShowParkingInformation] = useState(false);


  /* Handlers */
  const handleCloseParkingInformation = () => setShowParkingInformation(false);
  const handleShowParkingInformation = () => setShowParkingInformation(true);

  /* Components */
  function AppHeader() {
    return (
      <div className="App-header">
        <h1>Parking Information</h1>
      </div>
    );
  }

  function AppMain() {
    return (
      <div className="App-main">
        <div className = "button1">
        <Button variant="primary" style={{backgroundColor: '#4b0082', color: 'white', border: 'none'}}  onClick={handleShowParkingInformation}>
          Parking Information
        </Button>
          </div>
        <ParkingInformation
          show={showParkingInformation}
          handleClose={handleCloseParkingInformation}
        />
      </div>
    );
  }

  /* Render */
  return (
    <>
      <AppHeader />
      <AppMain />
    </>
  );
}

export default App;
