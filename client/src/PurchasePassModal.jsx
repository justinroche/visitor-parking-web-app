import React, { useState } from 'react';
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
}) {
  /* State */
  const [formData, setFormData] = useState({
    licensePlate: '',
    passLengthType: '',
    passLengthValue: '1',
    notificationsEnabled: false,
    notificationTime: '15min',
    phoneNumber: '',
  });

  /* Handlers */
  // handleInputChange updates the form data when the user edits an input field.
  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  }

  // handleContinueButton validates user inputs and continues to the payment modal.
  function handleContinueButton() {
    // If any required fields are missing, prevent form submission.
    if (
      !formData.licensePlate ||
      !formData.passLengthType ||
      !formData.passLengthValue
    ) {
      alert('Please enter your license plate and set a duration.');
      return;
    }

    // Pass length must be between 1 and 7.
    if (formData.passLengthValue < 1 || formData.passLengthValue > 7) {
      alert(
        'The number of ' + formData.passLengthType + ' must be between 1 and 7.'
      );
      return;
    }

    // If notifications are enabled but phone number is missing, prevent form submission.
    if (formData.notificationsEnabled && !formData.phoneNumber) {
      alert('Please enter your phone number to enable notifications.');
      return;
    }

    // Prepare data to be sent to the backend.
    const formDataToSend = {
      licensePlate: formData.licensePlate,
      passLengthType: formData.passLengthType,
      passLengthValue: formData.passLengthValue,
      notificationsEnabled: formData.notificationsEnabled,
    };

    // Include additional fields if notifications are enabled.
    if (formData.notificationsEnabled) {
      formDataToSend.notificationTime = formData.notificationTime;
      formDataToSend.phoneNumber = formData.phoneNumber;
    }

    setPurchasePassData(formDataToSend); // Set the purchase pass data for the payment modal.
    handleShowPaymentModal(); // Show the payment modal.
    handleClose(); // Close this modal.
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
            placeholder="ABC-1234"
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
                Please specify the number of {formData.passLengthType}.
              </p>
              <input
                type="number"
                id="passLengthInput"
                name="passLengthValue"
                value={formData.passLengthValue}
                min={1}
                max={7}
                onChange={handleInputChange}
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

        {/* Only display time selection and phone number input if notifications have been enabled. */}
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
                id="phoneNumberInput"
                name="phoneNumber"
                placeholder="123-456-7890"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </form>
          </>
        )}
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
