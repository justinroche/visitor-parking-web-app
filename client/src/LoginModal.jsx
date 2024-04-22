import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './LoginModal.css';
import CreateAccountModal from './CreateAccountModal';

function LoginModal({ show, handleClose, handleLogin, fetchPasses }) {
  /* State */
  const [createAccountModalVisible, setCreateAccountModalVisible] =
    useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  /* Handlers */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const handleOpenCreateAccountModal = () => {
    setCreateAccountModalVisible(true);
  };

  const handleCloseCreateAccountModal = () => {
    setCreateAccountModalVisible(false);
  };

  const handleLoginAttempt = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/login-user',
        formData
      );
      if (response.status === 200) {
        await fetchPasses(formData.email); // Fetch user passes on successful login
        handleClose(); // Close the modal on successful login
        handleLogin(formData.email); // Update the login state
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          alert('Invalid email or password.');
        } else {
          alert(`Login failed with error code: ${status}`);
        }
      } else {
        alert('An error occurred during login. Please try again later.');
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Email input */}
        <form>
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
        </form>
        <br />

        {/* Password input */}
        <div>
          <input
            type={passwordVisibility ? 'text' : 'password'}
            id="passwordInput"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            tabIndex={2}
            required
          />
          &nbsp;&nbsp;
          <Button id="password-button" onClick={togglePasswordVisibility}>
            {passwordVisibility ? 'Hide' : 'Show'}
          </Button>
        </div>
        <br />
        {/* CreateAccountModal */}
        <p>
          Don't have an account? &nbsp;
          <button id="register-button" onClick={handleOpenCreateAccountModal}>
            Sign Up
          </button>
        </p>

        <CreateAccountModal
          show={createAccountModalVisible}
          handleClose={handleCloseCreateAccountModal}
        />
        <br />
        <br />
      </Modal.Body>

      <Modal.Footer>
        <div>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          &nbsp;&nbsp;
          <Button variant="primary" onClick={handleLoginAttempt}>
            Login
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default LoginModal;
