/* Import external components */
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';

/* Import local components */
import { serverURL } from './host.json';
import CreateAccountModal from './CreateAccountModal';
import PassSearchModal from './PassSearchModal';
import PaymentModal from './PaymentModal';
import ParkingInfoModal from './ParkingInfoModal';
import LoginModal from './LoginModal';
import AddTimeModal from './AddTimeModal';
import PurchasePassModal from './PurchasePassModal';
import VehicleModal from './VehicleModal';
import ReceiptModal from './ReceiptModal';
import ConfirmAddTimeModal from './ConfirmAddTimeModal';
import Availability from './Availability';
import UserPasses from './UserPasses';
import uww_logo from './media/UWWhitewater_logo.png';
import './App.css';

function App() {
  /* State */
  /* Modal visibility variables */
  const [showPurchasePassModal, setShowPurchasePassModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPassSearchModal, setShowPassSearchModal] = useState(false);
  const [showParkingInfoModal, setShowParkingInfoModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddTimeModal, setShowAddTimeModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showConfirmAddTimeModal, setShowConfirmAddTimeModal] = useState(false);

  /* User/helper variables */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [passes, setPasses] = useState([]);
  const [currentAvailability, setCurrentAvailability] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  /* Pass/receipt data variables */
  const [purchasePassData, setPurchasePassData] = useState({
    licensePlate: '',
    passCost: 0,
  });
  const [receiptData, setReceiptData] = useState({
    expirationDate: '',
    passCost: 0,
  });
  const [livePassData, setLivePassData] = useState({
    passID: 0,
    license: '',
    expirationDate: '',
    cost: 0,
    passLengthType: '',
    passLengthValue: '1',
    duration: 0,
  });

  /* Add time variables */
  const [addTimePass, setAddTimePass] = useState(null);
  const [addTimePassRemaining, setAddTimePassRemaining] = useState(null);

  /* Handlers */
  /* Modal handlers */
  const handleShowPurchasePassModal = () => {
    setPurchasePassData({
      licensePlate: '',
      passCost: 0,
    });
    setShowPurchasePassModal(true);
  };
  const handleClosePurchasePassModal = () => setShowPurchasePassModal(false);

  const handleShowPaymentModal = () => setShowPaymentModal(true);
  const handleClosePaymentModal = () => setShowPaymentModal(false);

  const handleShowParkingInfoModal = () => setShowParkingInfoModal(true);
  const handleCloseParkingInfoModal = () => setShowParkingInfoModal(false);

  const handleShowPassSearchModal = () => setShowPassSearchModal(true);
  const handleClosePassSearchModal = () => setShowPassSearchModal(false);

  const handleShowLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  const handleShowAddTimeModal = (passID, remaining) => {
    setAddTimePass(passID);
    setAddTimePassRemaining(remaining);
    setShowAddTimeModal(true);
  };
  const handleCloseAddTimeModal = () => setShowAddTimeModal(false);

  const handleShowVehicleModal = () => setShowVehicleModal(true);
  const handleCloseVehicleModal = () => setShowVehicleModal(false);

  const handleShowCreateAccountModal = () => setShowCreateAccountModal(true);
  const handleCloseCreateAccountModal = () => setShowCreateAccountModal(false);

  const handleShowReceiptModal = (receiptData) => {
    setReceiptData(receiptData);
    setShowReceiptModal(true);
  };
  const handleCloseReceiptModal = () => setShowReceiptModal(false);

  const handleShowConfirmAddTimeModal = (livePassData) => {
    setLivePassData({
      passID: livePassData.passID,
      license: livePassData.license,
      expirationDate: livePassData.expirationDate,
      cost: livePassData.cost,
      passLengthType: livePassData.passLengthType,
      passLengthValue: livePassData.passLengthValue,
      duration: livePassData.duration,
    });
    setShowConfirmAddTimeModal(true);
  };

  const handleCloseConfirmAddTimeModal = () =>
    setShowConfirmAddTimeModal(false);

  /* Login handlers */
  const handleLogin = (email, fullName) => {
    setIsLoggedIn(true);
    setUserFullName(fullName);
    setUserEmail(email.toLowerCase());
    fetchPasses(email); // Fetch passes when user logs in
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setUserFullName('');
    setPasses([]); // Clear passes when user logs out
  };

  /* Effects */
  /* Clear success message after 10 seconds */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 10000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  /* Fetch availability every minute */
  useEffect(() => {
    fetchAvailability();
    const intervalId = setInterval(fetchAvailability, 60000);
    return () => clearInterval(intervalId);
  });

  /* Fetch current availability */
  const fetchAvailability = async () => {
    try {
      const response = await axios.get(serverURL + '/availability');
      setCurrentAvailability(response.data.availability);
    } catch (error) {
      console.error(error);
    }
  };

  /* Fetch user's passes */
  const fetchPasses = async (email) => {
    try {
      const response = await axios.post(serverURL + '/passes', {
        email,
      });
      if (response.data.message === 'No passes found') {
        setPasses([]);
        return;
      }
      setPasses(response.data.passes);
    } catch (error) {
      console.error(error);
    }
  };

  /* Components */
  function AppHeader() {
    return (
      <div className="App-header">
        <div className="top-bar">
          <img src={uww_logo} alt="uww image" className="whitewater-logo" />
          <h1>Visitor Parking</h1>

          <div className="header-button-container">
            {!isLoggedIn && (
              <>
                <Button
                  className="header-button"
                  variant="secondary"
                  onClick={handleShowLoginModal}
                >
                  Log In
                </Button>
                <Button
                  id="sign-up-button"
                  className="header-button"
                  variant="secondary"
                  onClick={handleShowCreateAccountModal}
                >
                  Sign Up
                </Button>
              </>
            )}
            {isLoggedIn && (
              <Button
                className="header-button"
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

  function AppMain() {
    return (
      <div className="App-main">
        <div className="row">
          <div className="col" id="main-buttons-column">
            <Button
              id="info-button"
              className="primary-button main-page-button"
              variant="primary"
              onClick={handleShowParkingInfoModal}
            >
              Parking Pass Information
            </Button>
            <br />
            <br />
            <Button
              id="buy-pass-button"
              className="primary-button main-page-button"
              variant="primary"
              onClick={handleShowPurchasePassModal}
            >
              Buy a Pass
            </Button>
            {isLoggedIn && (
              <>
                <br />
                <br />
                <Button
                  id="add-vehicle-button"
                  className="primary-button main-page-button"
                  variant="primary"
                  onClick={handleShowVehicleModal}
                >
                  Add/Update Vehicles
                </Button>
              </>
            )}
            <br />
            <br />
            <Button
              id="pass-search-button"
              className="primary-button main-page-button"
              variant="primary"
              onClick={handleShowPassSearchModal}
            >
              Search for a Pass
            </Button>
          </div>

          <div className="col">
            {successMessage && (
              <Alert className="alert" severity="success">
                <AlertTitle>{successMessage}</AlertTitle>
              </Alert>
            )}
            {isLoggedIn ? (
              <UserPasses
                email={userEmail}
                passes={passes}
                handleShowAddTimeModal={handleShowAddTimeModal}
                fetchPasses={fetchPasses}
                fetchAvailability={fetchAvailability}
              />
            ) : (
              <h5 className="log-in-message">
                Please log in to view your passes or continue as a guest.
              </h5>
            )}
          </div>

          <Availability
            userFullName={userFullName}
            currentAvailability={currentAvailability}
          />
        </div>

        <br />
        <br />

        <LoginModal
          show={showLoginModal}
          handleClose={handleCloseLoginModal}
          handleLogin={handleLogin}
          fetchPasses={fetchPasses}
          handleShowCreateAccountModal={handleShowCreateAccountModal}
        />
        <CreateAccountModal
          show={showCreateAccountModal}
          handleClose={handleCloseCreateAccountModal}
          setSuccessMessage={setSuccessMessage}
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
          email={userEmail}
        />
        <PaymentModal
          show={showPaymentModal}
          handleClose={handleClosePaymentModal}
          purchasePassData={purchasePassData}
          fetchPasses={fetchPasses}
          isLoggedIn={isLoggedIn}
          email={userEmail}
          setSuccessMessage={setSuccessMessage}
          handleShowReceiptModal={handleShowReceiptModal}
          handleShowConfirmAddTimeModal={handleShowConfirmAddTimeModal}
        />
        <AddTimeModal
          show={showAddTimeModal}
          handleClose={handleCloseAddTimeModal}
          isLoggedIn={isLoggedIn}
          handleShowPaymentModal={handleShowPaymentModal}
          setPurchasePassData={setPurchasePassData}
          pass={passes.find((pass) => pass.passID === addTimePass)}
          remaining={addTimePassRemaining}
        />
        <VehicleModal
          show={showVehicleModal}
          handleClose={handleCloseVehicleModal}
          userEmail={userEmail}
        />
        <PassSearchModal
          show={showPassSearchModal}
          handleClose={handleClosePassSearchModal}
        />
        <ReceiptModal
          show={showReceiptModal}
          handleClose={handleCloseReceiptModal}
          receiptData={receiptData}
        />
        <ConfirmAddTimeModal
          show={showConfirmAddTimeModal}
          handleClose={handleCloseConfirmAddTimeModal}
          livePassData={livePassData}
          handleShowReceiptModal={handleShowReceiptModal}
          fetchPasses={fetchPasses}
          isLoggedIn={isLoggedIn}
          email={userEmail}
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
