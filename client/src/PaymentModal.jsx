import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import './PaymentModal.css';

function PaymentModal({
  show,
  handleClose,
  purchasePassData,
  fetchPasses,
  isLoggedIn,
}) {
  /* State */
  const [paymentData, setPaymentData] = useState({
    nameOnCard: '',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
  });

  /* Effect */
  // These effects are a bit janky...
  // Format card number with spaces and max length
  useEffect(() => {
    let formattedCardNumber = paymentData.cardNumber
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();

    if (formattedCardNumber.length > 19) {
      formattedCardNumber = formattedCardNumber.slice(0, 19);
    }

    setPaymentData({ ...paymentData, cardNumber: formattedCardNumber });
  }, [paymentData.cardNumber]);

  // Format expiration date with slash and max length
  useEffect(() => {
    let formattedExpirationDate = paymentData.expirationDate.replace(/\//g, '');
    if (formattedExpirationDate.length > 2) {
      formattedExpirationDate =
        formattedExpirationDate.slice(0, 2) +
        '/' +
        formattedExpirationDate.slice(2);
    }

    if (formattedExpirationDate.length > 5) {
      formattedExpirationDate = formattedExpirationDate.slice(0, 5);
    }

    setPaymentData({ ...paymentData, expirationDate: formattedExpirationDate });
  }, [paymentData.expirationDate]);

  // Limit CVC to 3 digits
  useEffect(() => {
    let formattedCVC = paymentData.cvc;
    if (formattedCVC.length > 3) {
      formattedCVC = formattedCVC.slice(0, 3);
    }

    setPaymentData({ ...paymentData, cvc: formattedCVC });
  }, [paymentData.cvc]);

  /* Handlers */
  // handleInputChange updates the payment data when the user edits an input field.
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  function handleCloseButton() {
    // TODO: Ask the user if they are sure before closing the modal.
    handleClose();
  }

  // handleSubmitButton merges the pass and payment data and sends it to the backend.
  function handleSubmitButton() {
    /* Verify that all fields are present */
    if (
      !paymentData.nameOnCard ||
      !paymentData.cardNumber ||
      !paymentData.expirationDate ||
      !paymentData.cvc
    ) {
      alert('Please fill all required fields.');
      return;
    }

    /* Verify card number */
    const cardNumberRegex = /^\d{4}(\s?\d{4}){3}$/;
    const formattedCardNumber = paymentData.cardNumber.replace(/\s/g, '');
    if (!cardNumberRegex.test(formattedCardNumber)) {
      alert('Please enter a valid 16-digit card number.');
      return;
    }

    /* Verify MM/YY expiration date */
    const expirationDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expirationDateRegex.test(paymentData.expirationDate)) {
      alert('Please enter a valid mm/yy expiration date.');
      return;
    }

    /* Verify 3-digit CVC */
    const cvcRegex = /^\d{3}$/;
    if (!cvcRegex.test(paymentData.cvc)) {
      alert('Please enter a valid 3-digit CVC.');
      return;
    }

    const mergedData = { ...purchasePassData, ...paymentData };

    axios
      .post('http://localhost:8080/purchase-pass', mergedData)
      .then((response) => {
        console.log(response.data);

        if (isLoggedIn) {
          fetchPasses(mergedData.email);
        }
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
        <Form>
          <Form.Group controlId="nameOnCard">
            <Form.Label>Name on Card</Form.Label>
            <Form.Control
              type="text"
              name="nameOnCard"
              value={paymentData.nameOnCard}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              placeholder="MM/YY"
            />
          </Form.Group>
          <br />

          <Form.Group controlId="cvc">
            <Form.Label>CVC</Form.Label>
            <Form.Control
              type="text"
              name="cvc"
              value={paymentData.cvc}
              onChange={handleInputChange}
              placeholder="CVC"
            />
          </Form.Group>
        </Form>
        <br />

        {purchasePassData && (
          <div id="totalSection">
            <h5>Total</h5>
            <p>${purchasePassData.passCost.toFixed(2)}</p>
          </div>
        )}
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
