import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ModalBody from 'react-bootstrap/esm/ModalBody';
import './TimeAddedModal.css';

function TimeAddedModal(show, handleClose) {
  return (
    // modal front end
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>An active pass for this license plate already exists. Do you want to add more time?</Modal.Title>
      </Modal.Header>
      {/* <Button class="confirm">Confirm</Button>
      <Button class="cancel">Close</Button> */}
      <ModalBody>
        <button class='cancel'>Cancel</button>
        <button class='confirm'>Confirm</button>
      </ModalBody>
    </Modal>
  );
}

export default TimeAddedModal;
