import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function PaymentModal({ show, handleClose, purchasePassData }) {
  // State for payment-related data
  const [paymentData, setPaymentData] = useState({
    nameOnCard: '',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
  });

  // Handle changes in payment-related inputs
  const handlePaymentInputChange = (event) => {
    const { name, value } = event.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  function handleCloseButton() {
    // TODO: Ask the user if they are sure before closing the modal.
    handleClose();
  }

  function handleSubmitButton() {
    // Send the data to the backend.
    const mergedData = { ...purchasePassData, ...paymentData };

    axios
      .post('http://localhost:8080/purchase-pass', mergedData)
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
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Purchase a Visitor Parking Pass</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Placeholder data */}
        <h5>Total</h5>
        <p>$25.00</p>

        <Form>
          <Form.Group controlId="nameOnCard">
            <Form.Label>Name on Card</Form.Label>
            <Form.Control
              type="text"
              name="nameOnCard"
              value={paymentData.nameOnCard}
              onChange={handlePaymentInputChange} // Handle change for nameOnCard input
              placeholder="Enter your name"
            />
          </Form.Group>
          <br />

          <Form.Group controlId="cardNumber">
            <Form.Label>Card Number</Form.Label>
            <Form.Control
              type="text"
              name="cardNumber"
              value={paymentData.cardNumber}
              onChange={handlePaymentInputChange} // Handle change for cardNumber input
              placeholder="1234 1234 1234 1234"
            />
          </Form.Group>
          <br />

          <Form.Group controlId="expirationDate">
            <Form.Label>Expiration Date</Form.Label>
            <Form.Control
              type="text"
              name="expirationDate"
              value={paymentData.expirationDate}
              onChange={handlePaymentInputChange} // Handle change for expirationDate input
              placeholder="MM / YY"
            />
          </Form.Group>
          <br />

          <Form.Group controlId="cvc">
            <Form.Label>CVC</Form.Label>
            <Form.Control
              type="text"
              name="cvc"
              value={paymentData.cvc}
              onChange={handlePaymentInputChange} // Handle change for cvc input
              placeholder="CVC"
            />
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
            onClick={handleSubmitButton}
          >
            Submit Payment
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default PaymentModal;
