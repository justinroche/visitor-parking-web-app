import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import leftImage from './CampusMap.jpg';

// This modal is a DEMO component. Use it as a reference.
function CampusParkingInfoModal({ show, handleClose }) {
  // Send a POST request to the server when the modal is closed.
  function handleCloseButton() {
    axios
      .post('http://localhost:8080/demo-modal', { data: 'modal closed' })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    handleClose();
  }

  // Send a POST request to the server when the modal is saved.
  /*function handleSaveButton() {
    axios
      .post('http://localhost:8080/demo-modal', { data: 'modal saved' })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    handleClose();
  }*/

  // Render the modal.
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Campus Restrictions</Modal.Title>
      </Modal.Header>
      <Modal.Body>

      <div className = "container">
        <div className = "text-container">
          <h5>Parking on Campus</h5>
           <p>A parking pass is required at all times except for 
           5 p.m. Fridays to 11:00 p.m. Sundays and Univeristy recognized holidays</p>

          <img src={leftImage} alt="Left Image" className="campus-map" />
        </div> 
      </div>
        
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseButton}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CampusParkingInfoModal;
