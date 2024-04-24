import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './CreateAccountModal.css';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { serverURL } from './host.json';

// Function to validate email address
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

function CreateAccountModal({ show, handleClose }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleCloseButton = () => {
    handleReset();
    handleClose();
  };

  // Handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  // Handle form submission
  const handleCreateButton = async () => {
    setAlertMessage(''); // Clear previous alert message
    const { firstName, lastName, email, password, confirmPassword } = formData;

    // Validate inputs
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setAlertMessage('Please fill out all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage('Passwords do not match. Please try again.');
      return;
    }

    if (!validateEmail(email)) {
      setAlertMessage('Please enter a valid email address.');
      return;
    }

    try {
      axios
        .post(serverURL + '/insert-user', formData)
        .then((response) => {})
        .catch((error) => {
          console.error('Error:', error);
        });

      // Success handling
      alert('Account created, you may now log in.');

      // Reset the form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      // Close the modal
      handleCloseButton();
    } catch (error) {
      console.error('Error:', error);

      // Error handling (e.g., notify the user)
      alert('Error inserting user data');
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <Modal show={show} onHide={handleCloseButton}>
      <Modal.Header closeButton>
        <Modal.Title>Create an Account</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Alert */}
        {alertMessage && (
          <Alert style={{ marginBottom: '10px' }} severity="error">
            <AlertTitle>{alertMessage}</AlertTitle>
          </Alert>
        )}
        <form>
          {/* First Name Input */}
          <div className="form-group">
            <label htmlFor="createAccountFirstNameInput">First Name</label>
            <br />
            <input
              id="createAccountFirstNameInput"
              className="create-account-input-box"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter First Name"
              tabIndex={1}
              required
            />
          </div>
          <br />

          {/* Last Name Input */}
          <div className="form-group">
            <label htmlFor="createAccountLastNameInput">Last Name</label>
            <br />
            <input
              id="createAccountFastNameInput"
              className="create-account-input-box"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter Last Name"
              tabIndex={2}
              required
            />
          </div>
          <br />

          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="createAccountEmailInput">Email</label>
            <br />
            <input
              id="createAccountEmailInput"
              className="create-account-input-box"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Email"
              tabIndex={3}
              required
            />
          </div>
          <br />

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="createAccountPasswordInput">Password </label>
            <br />
            <div className="password-container">
              <input
                id="createAccountPasswordInput"
                className="create-account-input-box"
                type={passwordVisibility ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter Password"
                tabIndex={4}
                required
              />
              <Button
                id="password-button"
                type="button"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon
                  icon={passwordVisibility ? faEyeSlash : faEye}
                />
              </Button>
            </div>
          </div>
          <br />

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="createAccountConfirmPasswordInput">
              Confirm Password
            </label>
            <br />
            <input
              id="createAccountConfirmPasswordInput"
              className="create-account-input-box"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              tabIndex={5}
              required
            />
          </div>
          {/* Passwords Match Validation */}
          {formData.password &&
            formData.confirmPassword &&
            formData.password !== formData.confirmPassword && (
              <span id="password-alert">Passwords must match!</span>
            )}
        </form>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <div>
          {/* Close and Reset Buttons */}
          <Button
            variant="secondary"
            onClick={handleCloseButton}
            id="close-button"
          >
            Close
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        </div>
        {/* Create Button */}
        <Button
          className="primary-button"
          variant="primary"
          onClick={handleCreateButton}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateAccountModal;
