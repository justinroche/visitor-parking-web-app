import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import DemoModal from './DemoModal';
import './App.css';

function App() {
  /* State */
  const [showCustomModal, setShowCustomModal] = useState(false);

  /* Handlers */
  const handleCloseCustomModal = () => setShowCustomModal(false);
  const handleShowCustomModal = () => setShowCustomModal(true);

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
        <Button variant="primary" onClick={handleShowCustomModal}>
          Show demo modal
        </Button>
        <DemoModal
          show={showCustomModal}
          handleClose={handleCloseCustomModal}
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
