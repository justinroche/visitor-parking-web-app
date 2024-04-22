import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './PurchasePassModal.css';

/* React Bootstrap has a whole system for handling forms: https://react-bootstrap.netlify.app/docs/forms/overview/
We might want to rewrite this to fit their outline in the future, but this works well enough for now. */
function PurchasePassModal({
  show, // Boolean to determine if the modal is visible.
  handleClose, // Function to close the modal.
  isLoggedIn, // Boolean to determine if the user is logged in. This displays the saved vehicles feature.
  handleShowPaymentModal, // Function to show the payment modal.
  setPurchasePassData, // Function to set the purchase pass data when the user continues to payment.
  email, // If the user is logged in, their email is passed to the modal.
}) {
  /* State */
  // formData is sent to the backend when the user pays.
  const [formData, setFormData] = useState({
    licensePlate: '',
    passLengthType: '',
    passLengthValue: '1',
    notificationsEnabled: false,
    notificationTime: '15',
    email: '',
    passCost: 0,
  });

  const [passCost, setPassCost] = useState(0);

  /* Effects */
  // Calculate pass cost
  useEffect(() => {
    function calculatePassCost() {
      // Cost per day is $5.
      const costPerDay = 5;
      // Cost per hour is y = 1.4x + 0.25.
      const costPerHour = 1.4;
      const costPerHourBase = 0.25;

      if (formData.passLengthType === 'hours') {
        setPassCost(costPerHour * formData.passLengthValue + costPerHourBase);
      } else if (formData.passLengthType === 'days') {
        setPassCost(costPerDay * formData.passLengthValue);
      }
    }

    calculatePassCost(); // Calculate pass cost initially and whenever pass length changes
  }, [formData.passLengthType, formData.passLengthValue]);

  // If the user selects a duration longer than 3 hours, reset the duration to 3 hours.
  useEffect(() => {
    if (formData.passLengthType === 'hours' && formData.passLengthValue > 3) {
      setFormData({ ...formData, passLengthValue: '3' });
    }
  }, [formData.passLengthType, formData.passLengthValue]);

  // Max length for license plate is 7 characters.
  useEffect(() => {
    if (formData.licensePlate.length > 7) {
      setFormData({
        ...formData,
        licensePlate: formData.licensePlate.substring(0, 7),
      });
    }
  }, [formData.licensePlate]);

  /* Handlers */
  // handleInputChange updates the form data when the user edits an input field.
  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;
    let newValue = type === 'checkbox' ? checked : value;

    // Convert license plate to uppercase if it's the license plate input
    if (name === 'licensePlate') {
      newValue = value.toUpperCase();
    }

    setFormData({ ...formData, [name]: newValue });
  }

  // handleContinueButton validates user inputs and continues to the payment modal.
  // This system uses alerts for error messages. We might want to change this to a more user-friendly system in the future.
  function handleContinueButton() {
    /* Verify that necessary fields are present */
    // If any required fields are missing, prevent form submission.
    if (
      !formData.licensePlate ||
      !formData.passLengthType ||
      !formData.passLengthValue
    ) {
      alert('Please enter your license plate and set a duration.');
      return;
    }

    // If notifications are enabled but email is missing, prevent form submission.
    if (formData.notificationsEnabled && !formData.email) {
      alert('Please enter your email address to enable notifications.');
      return;
    }

    /* Verify license plate length */
    if (formData.licensePlate.length < 1 || formData.licensePlate.length > 7) {
      alert(
        'Please enter a valid license plate (e.g., "123ABC" or "ABC1234").'
      );
      return;
    }

    /* Verify email format */
    if (formData.notificationsEnabled && !isValidEmail(formData.email)) {
      alert('Please enter a valid email address to enable notifications.');
      return;
    }

    if (formData.passLengthType === 'hours' && formData.passLengthValue > 3) {
      alert('The maximum duration for an hourly pass is 3 hours.');
      return;
    }

    if (formData.passLengthType === 'days' && formData.passLengthValue > 7) {
      alert('The maximum duration for an daily pass is one week.');
      return;
    }

    // Prepare data to be sent to the backend.
    const formDataToSend = {
      licensePlate: formData.licensePlate,
      passLengthType: formData.passLengthType,
      passLengthValue: formData.passLengthValue,
      passCost: passCost,
      notificationsEnabled: formData.notificationsEnabled,
    };

    // Include additional fields if notifications are enabled.
    if (formData.notificationsEnabled) {
      formDataToSend.notificationTime = formData.notificationTime;
      formDataToSend.email = formData.email;
    }

    if (isLoggedIn) {
      formDataToSend.email = email;
    }

    setPurchasePassData(formDataToSend); // Set the purchase pass data for the payment modal.
    handleShowPaymentModal(); // Show the payment modal.
    handleClose(); // Close this modal.
  }

  function isValidEmail(email) {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Render the modal.
  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Purchase a Visitor Parking Pass</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* License plate text input */}
        <h5>License Plate</h5>
        <form>
          <input
            type="text"
            id="licensePlateInput"
            name="licensePlate"
            placeholder="ABC1234"
            value={formData.licensePlate}
            onChange={handleInputChange}
          />
        </form>
        <br />

        {/* Saved vehicles dropdown
        Only display saved vehicles if user is logged in.
        This feature is work in progress and contains placeholder data.
        TODO: Implement saved vehicles. */}
        {isLoggedIn && (
          <>
            <h5>Saved Vehicles</h5>
            <select name="vehicle" id="vehicleSelect">
              <option value="vehicle-1">Vehicle 1</option>
              <option value="vehicle-2">Vehicle 2</option>
              <option value="vehicle-3">Vehicle 3</option>
            </select>
            <br />
            <br />
          </>
        )}

        {/* Pass duration radio buttons */}
        <h5>Pass Duration</h5>
        <form>
          <input
            type="radio"
            id="hourlyRadioButton"
            name="passLengthType"
            value="hours"
            checked={formData.passLengthType === 'hours'}
            onChange={handleInputChange}
          />
          <label className="radioButtonLabel" htmlFor="hourlyRadioButton">
            Hourly
          </label>

          <input
            type="radio"
            id="dailyRadioButton"
            name="passLengthType"
            value="days"
            checked={formData.passLengthType === 'days'}
            onChange={handleInputChange}
          />
          <label className="radioButtonLabel" htmlFor="dailyRadioButton">
            Daily
          </label>

          {/* Only display pass length selector after hours/weeks have been specified. */}
          {formData.passLengthType !== '' && (
            <>
              <p id="passLengthPrompt">
                Please specify the number of {formData.passLengthType} (
                {formData.passLengthType === 'hours' ? 3 : 7} max).
              </p>
              <input
                type="number"
                id="passLengthInput"
                name="passLengthValue"
                value={formData.passLengthValue}
                min={1}
                max={formData.passLengthType === 'hours' ? 3 : 7}
                onChange={handleInputChange}
                inputMode="numeric" // Restrict input to numeric values
                onKeyDown={(e) => e.preventDefault()} // Prevent direct input
              />
            </>
          )}
        </form>
        <br />

        {/* Push notifications checkbox 
        TODO: Setup notification API? */}
        <h5>Push Notifications</h5>
        <input
          type="checkbox"
          id="pushNotificationCheckbox"
          name="notificationsEnabled"
          checked={formData.notificationsEnabled}
          onChange={handleInputChange}
        />
        <label id="notificationLabel" htmlFor="pushNotificationCheckbox">
          Enable push notifications
        </label>

        {/* Only display time selection and email input if notifications have been enabled. */}
        {formData.notificationsEnabled && (
          <>
            <p id="notificationPrompt">
              How long before your pass expires should we notify you?
            </p>

            <select
              name="notificationTime"
              id="notificationTimeSelector"
              value={formData.notificationTime}
              onChange={handleInputChange}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
            <form>
              {email == '' && (
                <input
                  type="text"
                  id="emailInput"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              )}
              {email && (
                <input
                  type="text"
                  id="emailInput"
                  name="formEmail"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleInputChange}
                  disabled
                />
              )}
            </form>
          </>
        )}

        <div id="passCostSection">
          <br />
          <h5>Total</h5>
          <p>${passCost.toFixed(2)}</p>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="container d-flex justify-content-between">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleContinueButton}>
            Continue to Payment
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default PurchasePassModal;
