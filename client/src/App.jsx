import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import './App.css';
import Button from 'react-bootstrap/Button';
import PurchasePassModal from './PurchasePassModal';
import leftImage from './CampusMap.jpg';

function App() {
  /* State */
    const [showPurchasePassModal, setShowPurchasePassModal] = useState(false); // State for purchase a pass modal

  /* Handlers */
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
        <div className = "button1">
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
      <MyComponent />
      <TextBox />
    </>
  );
}

export default App;

