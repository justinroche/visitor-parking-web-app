import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import CustomModal from './CustomModal';
import './App.css';

function App() {
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleCloseCustomModal = () => setShowCustomModal(false);
  const handleShowCustomModal = () => setShowCustomModal(true);

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
        <Button variant="primary" onClick={handleShowCustomModal}>
          Show demo modal
        </Button>
        <CustomModal show={showCustomModal} handleClose={handleCloseCustomModal} />
      </div>
    );
  }

  return (
    <>
      <AppHeader />
      <AppMain />
    </>
  );
}

export default App;
