import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import './App.css';
import Button from 'react-bootstrap/Button';
import PurchasePassModal from './PurchasePassModal';
import DemoModal from './DemoModal';

function App() {
  /* State */
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showPurchasePassModal, setShowPurchasePassModal] = useState(false); // State for purchase a pass modal

  /* Handlers */
  const handleCloseDemoModal = () => setShowDemoModal(false);
  const handleShowDemoModal = () => setShowDemoModal(true);

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
        <Button variant="primary" onClick={handleShowDemoModal}>
          Show demo modal
        </Button>
        <br></br>
        <br></br>
        <Button variant="primary" onClick={handleShowPurchasePassModal}>
          Purchase a pass
        </Button>
        <DemoModal show={showDemoModal} handleClose={handleCloseDemoModal} />
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
    </>
  );
}

export default App;
