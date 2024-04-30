import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function ConfirmAddTimeModal({
  show,
  handleClose,
  livePassData,
  handleShowReceiptModal,
  fetchPasses,
  isLoggedIn,
  email,
}) {
  function handleConfirm() {
    axios
      .post('http://localhost:8080/confirm-add-time', { livePassData })
      .then((response) => {
        if (isLoggedIn) {
          fetchPasses(email);
        }
        handleShowReceiptModal(response.data.receiptData);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    handleClose();
  }

  let plaintextPassLength =
    livePassData.passLengthValue + ' ' + livePassData.passLengthType;

  if (livePassData.passLengthValue === '1') {
    plaintextPassLength = plaintextPassLength.slice(0, -1);
  }

  const currentExpirationDate = new Date(livePassData.expirationDate);

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Live Pass Already Exists</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          A live pass for the license plate <b>{livePassData.license}</b>{' '}
          already exists. Would you like to add {plaintextPassLength} to the
          pass instead?
        </p>
        <p>
          <b>Current expiration:</b>{' '}
          {currentExpirationDate.toLocaleDateString()} at{' '}
          {currentExpirationDate.toLocaleTimeString()}
        </p>
        <p>
          <b>Total:</b> ${livePassData.cost.toFixed(2)}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} variant="secondary">
          Cancel
        </Button>
        <Button
          className="primary-button"
          onClick={handleConfirm}
          variant="primary"
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmAddTimeModal;
