import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import './App.css';
import Button from 'react-bootstrap/Button';
import DemoModal from './DemoModal';

function App() {
  /* State */
  const [showDemoModal, setShowDemoModal] = useState(false);

  /* Handlers */
  const handleCloseDemoModal = () => setShowDemoModal(false);
  const handleShowDemoModal = () => setShowDemoModal(true);

  /* Components */
  function AppHeader() {
    return (
      <div className="App-header">
        <h1>Visitor Parking</h1>
      </div>
    );
  }

/* function MyComponent() {
    return (
      <div className="container">
        <img src={leftImage} alt="Left Image" className="left-image" />
        
      </div>
    );
  } */
  
function TextBox () {
    return (
      <div className = "container">
        <div className = "text-container">
          <p>Parking on Campus</p>
           <p>A parking pass is required at all times except for 
           5 p.m. Fridays to 11:00 p.m. Sundays</p>
          <p>and Univeristy recognized holidays</p>
        </div> 

      </div>
    )
  }

  function AppMain() {
    return (
      <div className="App-main">
        <Button variant="primary" onClick={handleShowDemoModal}>
          Show demo modal
        </Button>
        <DemoModal
          show={showDemoModal}
          handleClose={handleCloseDemoModal}
        />
        <ParkingInfoModal
          show={showParkingInfoModal}
          handleClose={handleCloseParkingInfoModal}
          handlePaymentModalOpen={handlePaymentModalOpen}
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
      
      <TextBox />
    </>
  );
}

export default App;
