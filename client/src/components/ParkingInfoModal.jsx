import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function ParkingInfoModal({ show, handleClose }) {
  // Render the modal.
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Visitor Parking Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Here is the visitor parking information...</p>
        <p>More info, etc.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ParkingInfoModal;
