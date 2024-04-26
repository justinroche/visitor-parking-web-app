import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import './App.css';
import Button from 'react-bootstrap/Button';
import PaymentModal from './PaymentModal';
import ParkingInfoModal from './ParkingInfoModal';
import uww_logo from './media/UWWhitewater_logo.png';
import LoginModal from './LoginModal';
import AddTimeModal from './AddTimeModal';
import PurchasePassModal from './PurchasePassModal';
import VehicleModal from './VehicleModal';
import DateTime from './DateTime';
import UserPasses from './UserPasses';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';
import Availability from './Availability';
import { serverURL } from './host.json';
import CreateAccountModal from './CreateAccountModal';

function App() {
  /* State */
  const [showPurchasePassModal, setShowPurchasePassModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [purchasePassData, setPurchasePassData] = useState({
    licensePlate: '',
    passCost: 0,
  });
  const [showParkingInfoModal, setShowParkingInfoModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAccountSettingsModal, setShowAccountSettingsModal] =
    useState(false);
  const [showAddTimeModal, setShowAddTimeModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [passes, setPasses] = useState([]);
  const [addTimePass, setAddTimePass] = useState(null);
  const [addTimePassRemaining, setAddTimePassRemaining] = useState(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentAvailability, setCurrentAvailability] = useState(null);
  /* Handlers */
  const handleClosePurchasePassModal = () => setShowPurchasePassModal(false);
  const handleShowPurchasePassModal = () => {
    setPurchasePassData({
      licensePlate: '',
      passCost: 0,
    });
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
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const handleShowAccountSettingsModal = () =>
    setShowAccountSettingsModal(true);
  const handleCloseAddTimeModal = () => setShowAddTimeModal(false);
  const handleShowAddTimeModal = (passID, remaining) => {
    setAddTimePass(passID);
    setAddTimePassRemaining(remaining);
    setShowAddTimeModal(true);
  };
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
  const handleShowVehicleModal = () => setShowVehicleModal(true);
  const handleCloseVehicleModal = () => setShowVehicleModal(false);

  const handleOpenCreateAccountModal = () => {
    setShowCreateAccountModal(true);
  };

  const handleCloseCreateAccountModal = () => {
    setShowCreateAccountModal(false);
  };

  useEffect(() => {
    // Clear the success message after 10 seconds
    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 10000);

    return () => {
      clearTimeout(timer); // Clear the timer when the component unmounts
    };
  }, [successMessage]);

  // Fetch number of avilable spots every minute
  useEffect(() => {
    fetchAvailability();

    const intervalId = setInterval(fetchAvailability, 60000);

    // Clear interval when component unmounts
    return () => clearInterval(intervalId);
  });

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(serverURL + '/availability');
      setCurrentAvailability(response.data.availability);
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

          <div className="button-container">
            {/* Hide account settings window for the time being */}
            {false && isLoggedIn && (
              <Button
                className="account-settings"
                variant="secondary"
                onClick={handleShowAccountSettingsModal}
              >
                Account Settings
              </Button>
            )}
            {!isLoggedIn && (
              <>
                <Button
                  className="login-button"
                  variant="secondary"
                  onClick={handleShowLoginModal}
                >
                  Log In
                </Button>
                <Button
                  className="sign-up-button"
                  variant="secondary"
                  onClick={handleOpenCreateAccountModal}
                >
                  Sign Up
                </Button>
              </>
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

  async function fetchPasses(email) {
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
      // Handle error
    }
  }

  function AppMain() {
    return (
      <div className="App-main">
        <div className="row">
          <div className="col">
            <Button
              id="info-button"
              className="primary-button"
              variant="primary"
              onClick={handleShowParkingInfoModal}
            >
              Parking Pass Information
            </Button>
            <br />
            <br />
            <Button
              id="buy-pass-button"
              className="primary-button"
              variant="secondary"
              onClick={handleShowPurchasePassModal}
            >
              Buy A Pass
            </Button>
            <br />
            <br />
            {isLoggedIn && (
              <Button
                id="add-vehicle-button"
                className="primary-button"
                variant="secondary"
                onClick={handleShowVehicleModal}
              >
                Add/Update Vehicles
              </Button>
            )}
          </div>

          <div className="col">
            {isLoggedIn ? (
              <>
                {successMessage && (
                  <Alert className="alert" severity="success">
                    <AlertTitle>{successMessage}</AlertTitle>
                  </Alert>
                )}
                <UserPasses
                  email={userEmail}
                  passes={passes}
                  handleShowAddTimeModal={handleShowAddTimeModal}
                  fetchPasses={fetchPasses}
                  fetchAvailability={fetchAvailability}
                />
              </>
            ) : (
              <>
                {successMessage && (
                  <Alert className="alert" severity="success">
                    <AlertTitle>{successMessage}</AlertTitle>
                  </Alert>
                )}
                <h5 className="log-in-message">
                  Please log in to view your passes or continue as a guest.
                </h5>
              </>
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
          handleOpenCreateAccountModal={handleOpenCreateAccountModal}
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
      </div>
    );
  }

  /* Render */
  return (
    <>
      <AppHeader />
      <AppMain />
      {/*<Alert severity="success">Sample Success Message</Alert>
      <Alert severity="error">Sample Error Message</Alert>*/}
    </>
  );
}

export default App;
