import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './AddTimeModal';

function AddTimeModal({
  
    show, // Boolean to determine if the modal is visible.
    handleClose, // Function to close the modal.
    //isLoggedIn, // Boolean to determine if the user is logged in. This displays the saved vehicles feature.
    handleShowPaymentModal, // Function to show the payment modal.
    setPurchasePassData, // Function to set the purchase pass data when the user continues to payment.
}){

  const [formData, setFormData] = useState({
    licensePlate: '',
    passLengthType: '',
    passLengthValue: '1',
    notificationsEnabled: false,
    notificationTime: '15min',
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
    console.log("continue button clicked");
    /* Verify that necessary fields are present */
    // If any required fields are missing, prevent form submission.
    if (!formData.passLengthType || !formData.passLengthValue) {
      alert('Please set a duration.');
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
  // add this in the passCostSection div to have a running total of
  // the cost when they add time ${passCost.toFixed(2)}
        
  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add Time To Existing Pass</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        
        {/* This should be recieved from the database */}
        <h5>License Plate</h5>
        <p>862-PCG</p>

        {/* This should be recieved from the database */}
        <h5>Time Remaining</h5>
        <p>31:02</p>
        
        <h5>How much time would you like to add?</h5>
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
          <br /><br />

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
                <option value="15min">15 minutes</option>
                <option value="30min">30 minutes</option>
                <option value="45min">45 minutes</option>
                <option value="60min">60 minutes</option>
              </select>
              <form>
                <input
                  type="text"
                  id="emailInput"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </form>
            </>
          )}
        </form>

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
          <Button className='save-button' variant="primary" onClick={handleContinueButton}>
            Continue to Payment
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default AddTimeModal;