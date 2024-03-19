import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './PurchasePassModal.css';

/* React Bootstrap has a whole system for handling forms: https://react-bootstrap.netlify.app/docs/forms/overview/
We might want to rewrite this to fit their outline in the future, but this works well enough for now. */
function PurchasePassModal({ show, handleClose, isLoggedIn }) {
  /* State */
  // formData contains all information entered and sent to the backend.
  const [formData, setFormData] = useState({
    licensePlate: '',
    passLength: '',
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

  // handlePayButton sends the relevant form data to the backend when the user clicks the pay button.
  function handlePayButton() {
    // If any required fields are missing, prevent form submission.
    if (!formData.licensePlate || !formData.passLength) {
      alert('Please enter your license plate and select a duration.');
      return;
    }

    // If notifications are enabled but phone number is missing, prevent form submission.
    if (formData.notificationsEnabled && !formData.phoneNumber) {
      alert('Please enter your phone number to enable notifications.');
      return;
    }

    // Prepare data to be sent to the backend.
    const dataToSend = {
      licensePlate: formData.licensePlate,
      passLength: formData.passLength,
      notificationsEnabled: formData.notificationsEnabled,
    };

    // Include additional fields if notifications are enabled.
    if (formData.notificationsEnabled) {
      dataToSend.notificationTime = formData.notificationTime;
      dataToSend.phoneNumber = formData.phoneNumber;
    }

    // Send the data to the backend.
    axios
      .post('http://localhost:8080/purchase-pass', dataToSend)
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
          <div>
            <h5>Saved Vehicles</h5>
            <select name="vehicle" id="vehicleSelect">
              <option value="vehicle-1">Vehicle 1</option>
              <option value="vehicle-2">Vehicle 2</option>
              <option value="vehicle-3">Vehicle 3</option>
            </select>
            <br />
            <br />
          </div>
        )}

        {/* Pass duration radio buttons
        TODO: Allow user to specify number of days/hours. */}
        <h5>Pass Duration</h5>
        <form>
          <input
            type="radio"
            id="hourlyRadioButton"
            name="passLength"
            value="hourly"
            checked={formData.passLength === 'hourly'}
            onChange={handleInputChange}
          />
          <label className="radioButtonLabel" htmlFor="hourlyRadioButton">
            Hourly
          </label>

          <input
            type="radio"
            id="dailyRadioButton"
            name="passLength"
            value="daily"
            checked={formData.passLength === 'daily'}
            onChange={handleInputChange}
          />
          <label className="radioButtonLabel" htmlFor="dailyRadioButton">
            Daily
          </label>

          <input
            type="radio"
            id="weeklyRadioButton"
            name="passLength"
            value="weekly"
            checked={formData.passLength === 'weekly'}
            onChange={handleInputChange}
          />
          <label className="radioButtonLabel" htmlFor="weeklyRadioButton">
            Weekly
          </label>
        </form>
        <br />

        {/* Push notifications checkbox 
        TODO: Setup notification API? */}
        <h5>Push Notifications</h5>
        <div>
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
        </div>

        {/* Only display time selection and phone number input if notifications have been enabled. */}
        {formData.notificationsEnabled && (
          <div>
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
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <div className="container d-flex justify-content-between">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePayButton}>
            Pay
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default PurchasePassModal;
