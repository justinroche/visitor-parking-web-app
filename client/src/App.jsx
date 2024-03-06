import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import DemoModal from './DemoModal';
import './App.css';
import ParkingInfoModal from './components/ParkingInfoModal';

function App() {
  /* State */
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showParkingInfoModal, setShowParkingInfoModal] = useState(false);

  /* Handlers */
  const handleShowDemoModal = () => setShowDemoModal(true);
  const handleCloseDemoModal = () => setShowDemoModal(false);

  const handleShowParkingInfoModal = () => setShowParkingInfoModal(true);
  const handleCloseParkingInfoModal = () => setShowParkingInfoModal(false);

  /* Components */
  function AppHeader() {
    return (
      <div className="App-header">
        <h1>Visitor Parking</h1>
      </div>
    );
  }

  function AppMain() {
    return (
      <div className="App-main">
        <Button variant="primary" onClick={handleShowDemoModal}>
          Show demo modal
        </Button>
        <br />
        <Button variant="primary" onClick={handleShowParkingInfoModal}>
          Visitor Parking Information
        </Button>
        <DemoModal show={showDemoModal} handleClose={handleCloseDemoModal} />
        <ParkingInfoModal
          show={showParkingInfoModal}
          handleClose={handleCloseParkingInfoModal}
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
