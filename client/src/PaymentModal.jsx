import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function PaymentModal({ show, handleClose }) {
  function handleCloseButton() {
    // TODO: Ask the user if they are sure before closing the modal.
    handleClose();
  }

  // Send a POST request to the server when the modal is saved.
  function handleSaveButton() {
    axios
      .post('http://localhost:8080/payment-info', { data: 'modal saved' })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    handleClose();
  }

  // Render the modal.
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Purchase a Visitor Parking Pass</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Placeholder data */}
        <h5>Total</h5>
        <p>$25.00</p>

        <Form>
          <Form.Group controlId="nameOnCard">
            <Form.Label>Name on Card</Form.Label>
            <Form.Control type="text" placeholder="Enter your name" />
          </Form.Group>
          <br />

          <Form.Group controlId="cardNumber">
            <Form.Label>Card Number</Form.Label>
            <Form.Control type="text" placeholder="1234 1234 1234 1234" />
          </Form.Group>
          <br />

          <Form.Group controlId="expirationDate">
            <Form.Label>Expiration Date</Form.Label>
            <Form.Control type="text" placeholder="MM / YY" />
          </Form.Group>
          <br />

          <Form.Group controlId="cvc">
            <Form.Label>CVC</Form.Label>
            <Form.Control type="text" placeholder="CVC" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <div className="container d-flex justify-content-between">
          <Button variant="secondary" onClick={handleCloseButton}>
            Close
          </Button>
          <Button
            className="modal-button"
            variant="primary"
            onClick={handleSaveButton}
          >
            Submit Payment
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default PaymentModal;
