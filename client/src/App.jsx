import { useState } from 'react';
import React from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import PurchasePassModal from './PurchasePassModal';
import PaymentModal from './PaymentModal';
import PassSearchForm from './PassSearchForm';

function App() {
  /* State */
  const [showPurchasePassModal, setShowPurchasePassModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [purchasePassData, setPurchasePassData] = useState(null); // State for purchase pass data (license plate, credit card, etc.)

  /* Handlers */
  const handleClosePurchasePassModal = () => setShowPurchasePassModal(false);

  // Reset the purchase pass data when the modal is opened.
  const handleShowPurchasePassModal = () => {
    setPurchasePassData(null);
    setShowPurchasePassModal(true);
  };

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
        <Button variant="primary" onClick={handleShowPurchasePassModal}>
          Purchase a pass
        </Button>
        <br />
        <br />
        <PassSearchForm />
        <PurchasePassModal
          show={showPurchasePassModal}
          handleClose={handleClosePurchasePassModal}
          isLoggedIn={true}
          handleShowPaymentModal={handleShowPaymentModal}
          setPurchasePassData={setPurchasePassData}
        />
        <PaymentModal
          show={showPaymentModal}
          handleClose={handleClosePaymentModal}
          purchasePassData={purchasePassData}
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
