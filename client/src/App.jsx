import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import DemoModal from './DemoModal';
import './App.css';

function App() {
  /* State */
  const [showDemoModal, setShowDemoModal] = useState(false);

  /* Handlers */
  const handleCloseDemoModal = () => setShowDemoModal(false);
  const handleShowDemoModal = () => setShowDemoModal(true);

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
        {/* Add purchase a pass button */}
        <DemoModal show={showDemoModal} handleClose={handleCloseDemoModal} />
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
