import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import './PaymentModal.css';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';
import { serverURL } from './host.json';

function PaymentModal({
  show,
  handleClose,
  purchasePassData, // This modal receives the purchase pass data and sends it (along with the payment info) to the backend upon payment.
  fetchPasses,
  isLoggedIn,
  email,
  handleShowReceiptModal,
  handleShowConfirmAddTimeModal,
}) {
  /* State */
  const [paymentData, setPaymentData] = useState({
    nameOnCard: '',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
  });

  const [alertMessage, setAlertMessage] = useState('');

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

  // handleSubmitButton merges the pass and payment data and sends it to the backend.
  function handleSubmitButton() {
    setAlertMessage(''); // Clear previous alert message
    /* Verify that all fields are present */
    if (
      !paymentData.nameOnCard ||
      !paymentData.cardNumber ||
      !paymentData.expirationDate ||
      !paymentData.cvc
    ) {
      setAlertMessage('Please fill all required fields.');
      return;
    }

    /* Verify card number */
    const cardNumberRegex = /^\d{4}(\s?\d{4}){3}$/;
    const formattedCardNumber = paymentData.cardNumber.replace(/\s/g, '');
    if (!cardNumberRegex.test(formattedCardNumber)) {
      setAlertMessage('Please enter a valid 16-digit card number.');
      return;
    }

    /* Verify MM/YY expiration date */
    const expirationDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expirationDateRegex.test(paymentData.expirationDate)) {
      setAlertMessage('Please enter a valid mm/yy expiration date.');
      return;
    }

    /* Verify 3-digit CVC */
    const cvcRegex = /^\d{3}$/;
    if (!cvcRegex.test(paymentData.cvc)) {
      setAlertMessage('Please enter a valid 3-digit CVC.');
      return;
    }

    const mergedData = { ...purchasePassData, ...paymentData };

    // If the data contains a license plate, the user is buying a new pass.
    // If the data does not contain a license plate, the user is adding time to an existing pass.
    const endpoint = purchasePassData.licensePlate
      ? '/purchase-pass'
      : '/add-time';

    axios
      .post(serverURL + endpoint, mergedData)
      .then((response) => {
        if (response.data.message === 'Live pass exists') {
          // Confirm to add time if a live pass already exists
          handleShowConfirmAddTimeModal(response.data.livePassData);
        } else {
          // Otherwise, fetch the updated passes and show the receipt
          if (isLoggedIn) {
            fetchPasses(email);
          }
          handleShowReceiptModal(response.data.receiptData);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>
          {purchasePassData.licensePlate
            ? 'Purchase a Visitor Parking Pass'
            : 'Add Time to a Pass'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Alert */}
        {alertMessage && (
          <Alert id="payment-alert" severity="error">
            <AlertTitle>{alertMessage}</AlertTitle>
          </Alert>
        )}
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
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          className="primary-button"
          variant="primary"
          onClick={handleSubmitButton}
        >
          Submit Payment
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PaymentModal;
