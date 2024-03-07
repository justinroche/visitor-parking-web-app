import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function ParkingInfoModal({ show, handleClose }) {
  // Render the modal.
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Visitor Parking Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Here is the visitor parking information...</p>
        <p>More info, etc.</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
          commodi quos veritatis nulla dolores beatae, tenetur corrupti
          laboriosam rem pariatur consectetur. Laudantium, adipisci sit facilis
          unde cumque eum similique architecto dignissimos provident
          reprehenderit vel ullam blanditiis hic nesciunt. Laborum illum quaerat
          omnis excepturi animi alias possimus recusandae dolorum, facere
          deserunt.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ParkingInfoModal;
