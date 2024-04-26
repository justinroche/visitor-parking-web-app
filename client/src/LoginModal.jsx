import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './LoginModal.css';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';
import { serverURL } from './host.json';

function LoginModal({
  show,
  handleClose,
  handleLogin,
  fetchPasses,
  handleOpenCreateAccountModal,
}) {
  /* State */
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  /* Handlers */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const handlePasswordKeyPress = (event) => {
    // Check if Enter key is pressed (key code 13)
    if (event.key === 'Enter') {
      // Prevent default form submission behavior
      event.preventDefault();
      // Trigger login attempt
      handleLoginAttempt();
    }
  };

  const handleLoginAttempt = async () => {
    setAlertMessage(''); // Clear previous alert message
    try {
      const response = await axios.post(serverURL + '/login-user', formData);
      if (response.status === 200) {
        await fetchPasses(formData.email); // Fetch user passes on successful login
        handleClose(); // Close the modal on successful login
        handleLogin(
          formData.email,
          response.data.userData.firstName +
            ' ' +
            response.data.userData.lastName
        ); // Update the login state
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          setAlertMessage('Invalid email or password.');
        } else {
          setAlertMessage(`Login failed with error code: ${status}`);
        }
      } else {
        setAlertMessage(
          'An error occurred during login. Please try again later.'
        );
      }
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Log In</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Alert */}
          {alertMessage && (
            <Alert style={{ marginBottom: '10px' }} severity="error">
              <AlertTitle>{alertMessage}</AlertTitle>
            </Alert>
          )}
          {/* Email input */}
          <div className="input-group">
            <span className="input-group-text">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              type="email"
              id="emailInput"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              tabIndex={1}
              required
            />
          </div>
          <br />

          {/* Password input */}
          <div className="input-group">
            <span className="input-group-text">
              <FontAwesomeIcon icon={faLock} />
            </span>

            <input
              type={passwordVisibility ? 'text' : 'password'}
              id="passwordInput"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              onKeyDown={handlePasswordKeyPress}
              tabIndex={2}
              required
            />
            <Button id="password-button" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={passwordVisibility ? faEyeSlash : faEye} />
            </Button>
          </div>

          <br />
          <p id="no-account-text">Don't have an account?</p>
          <Button
            className="primary-button"
            variant="primary"
            onClick={handleOpenCreateAccountModal}
          >
            Sign Up
          </Button>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          <Button id="closebutton" variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            className="primary-button"
            variant="primary"
            onClick={handleLoginAttempt}
          >
            Log In
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginModal;
