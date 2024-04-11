import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import './App.css';
import Button from 'react-bootstrap/Button';
import DemoModal from './DemoModal';
import BuyAPassModal from './BuyAPassModal';
import PaymentModal from './PaymentModal';
import ParkingInfoModal from './ParkingInfoModal';
import uww_logo from "./UWWhitewater_logo.png";
import LoginModal from './LoginModal';
import AccountSettingsModal from './AccountSettingsModal';
import AddTimeModal from './AddTimeModal';

function App() {
  /* State */
  const [showBuyAPassModal, setShowBuyAPassModal] = useState(false); // State for parking info modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showParkingInfoModal, setShowParkingInfoModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAccountSettingsModal, setShowAccountSettingsModal] = useState(false);
  const [showAddTimeModal, setShowAddTimeModal] = useState(false);
  


  /* Handlers */
  const handleCloseBuyAPassModal = () => setShowBuyAPassModal(false); 
  const handleShowBuyAPassModal = () => setShowBuyAPassModal(true);
  const handleClosePaymentModal = () => setShowPaymentModal(false);
  const handleShowPaymentModal = () => setShowPaymentModal(true);
  const handlePaymentModalOpen = () => setShowPaymentModal(true);
  const handleCloseParkingInfoModal = () => setShowParkingInfoModal(false); 
  const handleShowParkingInfoModal = () => setShowParkingInfoModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);
  const handleShowLoginModal = () => setShowLoginModal(true);
  const handleCloseAccountSettingsModal = () => setShowAccountSettingsModal(false);
  const handleShowAccountSettingsModal = () => setShowAccountSettingsModal(true);
  const handleCloseAddTimeModal = () => setShowAddTimeModal(false);
  const handleShowAddTimeModal = () => setShowAddTimeModal(true);

  /* Components */
  function AppHeader() {
    return (
      <div className="App-header">
        <div className='top-bar'>
          <img src={uww_logo} alt="uww image" className="whitewater-logo" />
          <h1>Visitor Parking</h1>
          
          <div className="button-container">
            <Button className='account-settings' variant='secondary' onClick={handleShowAccountSettingsModal}>
              Account Settings
            </Button> 
            <Button className='login-button' variant='secondary' onClick={handleShowLoginModal}>
              Login
            </Button>
            <Button className='logout-button' variant='secondary'>
              Log Out
            </Button>
        </div>

        </div>  
      </div>
    );
  }

  function AppMain() {
    return (
      <div className="App-main">
      <div className="row">
        <div className="col">
          <Button id ='info-button' className="modal-button" variant="primary" onClick={handleShowParkingInfoModal}>
            Parking Pass Information
          </Button>
          <br />
          <br />
          <Button id = 'buy-pass-button' className="modal-button" variant="secondary" onClick={handleShowBuyAPassModal}>
            Buy A Pass
          </Button>
          <br/>
          <br/>

          </div>


        <div className="col">
          <table className="current-passes">
            <thead>
            <h5 style={{marginBottom: '30px'}} className='user-passes'>User's Current Passes</h5>
              <tr className='header-row'>
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
                <Button className="add-time-button" variant="secondary" onClick={handleShowAddTimeModal}>
                  Add Time
                </Button>
              </tr>
            </tbody>
          </table>
        </div>


        <div className='col'>
          <div className='availability'>
            <h5>Current Availability</h5>
          <p>27 spots remaining</p>
          </div>
         
        </div>
      </div>


      <br/>
      <br/>

      <LoginModal show={showLoginModal} handleClose={handleCloseLoginModal} isLoggedIn={false} />
      <AccountSettingsModal show={showAccountSettingsModal} handleClose={handleCloseAccountSettingsModal} isLoggedIn={true} />
      <ParkingInfoModal show={showParkingInfoModal} handleClose={handleCloseParkingInfoModal} />
      <BuyAPassModal show={showBuyAPassModal} handleClose={handleCloseBuyAPassModal} handlePaymentModalOpen={handlePaymentModalOpen} />
      <PaymentModal show={showPaymentModal} handleClose={handleClosePaymentModal} />
      <AddTimeModal show={showAddTimeModal} handleClose={handleCloseAddTimeModal} />
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
