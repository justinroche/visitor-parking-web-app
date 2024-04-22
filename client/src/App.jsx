import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import './App.css';
import Button from 'react-bootstrap/Button';
import DemoModal from './DemoModal';
import PaymentModal from './PaymentModal';
import ParkingInfoModal from './ParkingInfoModal';
import uww_logo from './UWWhitewater_logo.png';
import LoginModal from './LoginModal';
import AccountSettingsModal from './AccountSettingsModal';
import AddTimeModal from './AddTimeModal';
import PurchasePassModal from './PurchasePassModal';
import DateTime from './DateTime';

function App() {
  /* State */
  const [showPurchasePassModal, setShowPurchasePassModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [purchasePassData, setPurchasePassData] = useState(null); // State for purchase pass data (license plate, credit card, etc.)
  const [showParkingInfoModal, setShowParkingInfoModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAccountSettingsModal, setShowAccountSettingsModal] =
    useState(false);
  const [showAddTimeModal, setShowAddTimeModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  /* Handlers */
  const handleClosePurchasePassModal = () => setShowPurchasePassModal(false);
  const handleShowPurchasePassModal = () => {
    setPurchasePassData(null);
    setShowPurchasePassModal(true);
  };
  const handleClosePaymentModal = () => setShowPaymentModal(false);
  const handleShowPaymentModal = () => setShowPaymentModal(true);
  //const handlePaymentModalOpen = () => setShowPaymentModal(true);
  const handleCloseParkingInfoModal = () => setShowParkingInfoModal(false);
  const handleShowParkingInfoModal = () => setShowParkingInfoModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);
  const handleShowLoginModal = () => setShowLoginModal(true);
  const handleCloseAccountSettingsModal = () =>
    setShowAccountSettingsModal(false);
  const handleShowAccountSettingsModal = () =>
    setShowAccountSettingsModal(true);
  const handleCloseAddTimeModal = () => setShowAddTimeModal(false);
  const handleShowAddTimeModal = () => setShowAddTimeModal(true);
  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
  };

  /* Components */
  function AppHeader() {
    return (
      <div className="App-header">
        <div className="top-bar">
          <img src={uww_logo} alt="uww image" className="whitewater-logo" />
          <h1>Visitor Parking</h1>

          <div className="button-container">
            {isLoggedIn && (
              <Button
                className="account-settings"
                variant="secondary"
                onClick={handleShowAccountSettingsModal}
              >
                Account Settings
              </Button>
            )}
            {!isLoggedIn && (
              <Button
                className="login-button"
                variant="secondary"
                onClick={handleShowLoginModal}
              >
                Login
              </Button>
            )}
            {isLoggedIn && (
              <Button
                className="logout-button"
                variant="secondary"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${month}/${date}/${year}`;
  }

  function AppMain() {
    return (
      <div className="App-main">
        <div className="row">
          <div className="col">
            <Button
              id="info-button"
              className="modal-button"
              variant="primary"
              onClick={handleShowParkingInfoModal}
            >
              Parking Pass Information
            </Button>
            <br />
            <br />
            <Button
              id="buy-pass-button"
              className="modal-button"
              variant="secondary"
              onClick={handleShowPurchasePassModal}
            >
              Buy A Pass
            </Button>
            <br />
            <br />
          </div>

          <div className="col">
            {!isLoggedIn && (
              <h5 className="log-in-message">
                Please sign in or create an account to view your passes.
              </h5>
            )}
            {isLoggedIn && (
              <table className="current-passes">
                <thead>
                  <tr>
                    <th>
                      <h5
                        style={{ marginBottom: '30px' }}
                        className="user-passes"
                      >
                        User's Current Passes
                      </h5>
                    </th>
                  </tr>
                  <tr className="header-row">
                    <th>Plate Identification</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>Time Remaining</th>
                    <th>Add Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>862-PCG</td>
                    <td>Jeep</td>
                    <td>Gladiator</td>
                    <td>2024</td>
                    <td>31:02</td>
                    <td>
                      <Button
                        className="add-time-button"
                        variant="secondary"
                        onClick={handleShowAddTimeModal}
                      >
                        Add Time
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          <div className="col">
            <div className="availability">
              <h5>{isLoggedIn && `Welcome, ${userEmail}`}</h5>
            </div>
            <div className="availability">
              <DateTime />
            </div>
            <div className="availability">
              <h5>Current Availability</h5>
              <p>27 spots remaining</p>
            </div>
          </div>
        </div>

        <br />
        <br />

        <LoginModal
          show={showLoginModal}
          handleClose={handleCloseLoginModal}
          handleLogin={handleLogin}
        />
        <AccountSettingsModal
          show={showAccountSettingsModal}
          handleClose={handleCloseAccountSettingsModal}
          isLoggedIn={isLoggedIn}
        />
        <ParkingInfoModal
          show={showParkingInfoModal}
          handleClose={handleCloseParkingInfoModal}
        />
        <PurchasePassModal
          show={showPurchasePassModal}
          handleClose={handleClosePurchasePassModal}
          isLoggedIn={isLoggedIn}
          handleShowPaymentModal={handleShowPaymentModal}
          setPurchasePassData={setPurchasePassData}
        />
        <PaymentModal
          show={showPaymentModal}
          handleClose={handleClosePaymentModal}
          purchasePassData={purchasePassData}
        />
        <AddTimeModal
          show={showAddTimeModal}
          handleClose={handleCloseAddTimeModal}
          isLoggedIn={isLoggedIn}
          handleShowPaymentModal={handleShowPaymentModal}
          setPurchasePassData={setPurchasePassData}
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
