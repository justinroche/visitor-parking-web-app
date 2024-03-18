import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import './App.css';
import Button from 'react-bootstrap/Button';
import PurchasePassModal from './PurchasePassModal';

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

  function AppMain() {
    return (
      <div className="App-main">
        <Button variant="primary" onClick={handleShowPurchasePassModal}>
          Purchase a pass
        </Button>
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
