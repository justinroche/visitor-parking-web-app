import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import DemoModal from './DemoModal';
import './App.css';
import ParkingInfoModal from './ParkingInfoModal';
import PaymentModal from './PaymentModal';

function App() {
  /* State */
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showParkingInfoModal, setShowParkingInfoModal] = useState(false); // State for parking info modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  /* Handlers */
  const handleCloseDemoModal = () => setShowDemoModal(false);
  const handleShowDemoModal = () => setShowDemoModal(true);
  const handleCloseParkingInfoModal = () => setShowParkingInfoModal(false); 
  const handleShowParkingInfoModal = () => setShowParkingInfoModal(true);
  const handleClosePaymentModal = () => setShowPaymentModal(false);
  const handleShowPaymentModal = () => setShowPaymentModal(true);


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
        <br></br>
        <br></br>
        <Button variant="secondary" onClick={handleShowParkingInfoModal}> {/* Button to show parking info modal */}
          Parking Info
        </Button>
        <br></br>
        <br></br>
        <Button variant="secondary" onClick={handleShowPaymentModal}> {/* Button to show payment info modal */}
          Payment Info
        </Button>
        <DemoModal
          show={showDemoModal}
          handleClose={handleCloseDemoModal}
        />
        <ParkingInfoModal
          show={showParkingInfoModal}
          handleClose={handleCloseParkingInfoModal}
        />
        <PaymentModal
          show={showPaymentModal}
          handleClose={handleClosePaymentModal}
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
