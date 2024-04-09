import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import './App.css';
import Button from 'react-bootstrap/Button';
import PurchasePassModal from './PurchasePassModal';
import ParkingInformation from './ParkingInformation';
import


function App() {
  /* State */
 
  const [showParkingInformation, setShowParkingInformation] = useState(false);
  const [showPurchasePassModal, setShowPurchasePassModal] = useState(false); // State for purchase a pass modal


  /* Handlers */
  const handleCloseParkingInformation = () => setShowParkingInformation(false);
  const handleShowParkingInformation = () => setShowParkingInformation(true);
  const handleClosePurchasePassModal = () => setShowPurchasePassModal(false);
  const handleShowPurchasePassModal = () => setShowPurchasePassModal(true);

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
  function AppPurchasePass() {
    return (
      <div className="App-main">
       div className = "button2">
         <Button variant="primary" style={{backgroundColor: '#4b0082', color: 'white', border: 'none'}} onClick={handleShowPurchasePassModal}>
         Purchase a pass
          </Button>
        </div>
          <PurchasePassModal
          show={showPurchasePassModal}
          handleClose={handleClosePurchasePassModal}
          isLoggedIn={true}
         />
      </div>
    );
  }

          
 
  /* Render */
  return (
    <>
      <AppHeader />
      <AppMain />
      <AppPurchasePass />
    </>
  );
}

export default App;
