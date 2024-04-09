import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function ParkingInformation({ show, handleClose }) {
  // Render the modal.
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Visitor Parking Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
        <h2>General Parking Info</h2>
        
           <p>Parking Passes are required 24/7 with the following exceptions</p>
           <p>Starting 5 p.m. Fridays through 11 p.m. Sundays</p>
           <p> University recognized Holidays</p>
        <p>University of Wisconsin uses License Plate Recognition software to enforce parking regulations, therefor it is important that you enter you liecnse Plate correctly when purchasing your pass.</p>
        <p>You may purchase an Hourly, Daily, or Weekly Pass</p>
        
        <p>Cost per Pass</p>
        <p>1 Hour $1.25</p>
        <p>2 Hours $2.00</p>
        <p>3 Hours $3.00</p>
        <p>4 Hours $4.00</p>
        
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ParkingInformation;
