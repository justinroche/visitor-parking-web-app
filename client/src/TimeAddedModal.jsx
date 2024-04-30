import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './TimeAddedModal.css';

function TimeAddedModal({ show, handleClose, livePass }) {
  function handleCloseBtn() {
    // axios
    //   .post('http://localhost:8080/purchase-pass', mergedData)
    //   .then((response) => {
    //     console.log(response.data);

    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });

    handleClose();
  }

  function handleConfirmBtn() {
    console.log(livePass);

    axios
      .post('http://localhost:8080/time-added', { livePass })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    handleClose();
  }

  return (
    // modal front end
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>
          An active pass for this license plate already exists. Do you want to
          add more time?
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button onClick={handleCloseBtn} variant="secondary">
          Cancel
        </Button>
        <Button
          className="primary-button"
          onClick={handleConfirmBtn}
          variant="primary"
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TimeAddedModal;
