import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function TimeAddedModal({ show, handleClose }) {
  return (
    // modal front end
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Test for TimeAddedModal</Modal.Title>
      </Modal.Header>
      <Button variant="primary">Confirm</Button>
      <Button variant="secondary">Close</Button>
    </Modal>
  );
}

export default TimeAddedModal;
