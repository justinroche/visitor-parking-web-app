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
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Parking On Campus</Modal.Title>
      </Modal.Header>
      <Modal.Body>

      <div className = "container">
        <div className = "text-container">
          <h5>General Parking Information</h5>
          
        
        <p>Parking Passes are required 24/7 with the following exceptions</p>
        <p> * Starting 5 p.m. Fridays through 11 p.m. Sundays</p>
        <p> * University recognized Holidays</p>
     <p>University of Wisconsin uses License Plate Recognition software to enforce parking regulations, therefor it is important that you enter your liecnse plate correctly when purchasing your pass.</p>
     <p>You may purchase a daily permit. The daily permits are valid in commuter parking lots except between the hours of 2 am to 5 am.   These permits are not valid in parking stalls with signs saying "Restricted", "Reserved", "No Parking", or "Passport Metered Stalls".   In addition you are not allowed to park overnight with this permit.   The cost is $5.00 per day.  </p>
     <p>We offer daily and multi-day permits (up to 1 week) at $5.00 per day.   In addition we also offer hourly parking (1 to 4 hours). </p>
     <h6>Hourly Rates</h6>
     <p>1 Hour $1.65</p>
     <p>2 Hours $3.05</p>
     <p>3 Hours $4.45</p>
     <p>4 Hours $5.85</p>

     <p> Please refer to map below to see which lots you can park in (Visitor and Commuter parking)</p>
          <div className="campus-map-container">
          <img src={leftImage} alt="Left Image" className="campus-map" />
          </div> 
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
