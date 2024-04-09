import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import './App.css';
import Button from 'react-bootstrap/Button';
import LoginModal from './LoginModal';

import AccountSettingsModal from './AccountSettingsModal';

function App() {
  /* State */

  const [showLoginModal, setShowLoginModal] = useState(false);

  const [showAccountSettingsModal, setShowAccountSettingsModal] = useState(false);

  /* Handlers */

  const handleCloseLoginModal = () => setShowLoginModal(false);
  const handleShowLoginModal = () => setShowLoginModal(true);

  const handleCloseAccountSettingsModal = () => setShowAccountSettingsModal(false);
  const handleShowAccountSettingsModal = () => setShowAccountSettingsModal(true);

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

        <br/>
        <Button variant='primary' onClick={handleShowLoginModal}>
          Login
        </Button>
        <br/>

        <LoginModal
        show={showLoginModal}
        handleClose={handleCloseLoginModal}
        isLoggedIn={false}
        />
        <br/>

        <Button variant='primary' onClick={handleShowAccountSettingsModal}>
          Account Settings
        </Button>

        <AccountSettingsModal 
          show={showAccountSettingsModal}
          handleClose={handleCloseAccountSettingsModal}
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

