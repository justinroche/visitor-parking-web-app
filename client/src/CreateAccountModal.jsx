import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './CreateAccountModal.css';

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
    const { firstName, lastName, email, password, confirmPassword } = formData;

    // Validate inputs
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert('Please fill out all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      axios
        .post('http://localhost:8080/insert-user', formData)
        .then((response) => {
          console.log(response.data);
        })
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
      handleClose();
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
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create an Account</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form>
          {/* First Name Input */}
          <div className="form-group">
            <label>First Name</label>
            <br/>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder='Enter First Name'
              tabIndex={1}
              required
            />
          </div>
          <br/>

          {/* Last Name Input */}
          <div className="form-group">
            <label>Last Name</label>
            <br/>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder='Enter Last Name'
              tabIndex={2}
              required
            />
          </div>
          <br/>

          {/* Email Input */}
          <div className="form-group">
            <label>Email</label>
            <br/>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder='Enter Email'
              tabIndex={3}
              required
            />
          </div>
          <br/>

          {/* Password Input */}
          <div className="form-group">
            <label>Password </label>
            <br/>
            <div className="password-container">
              <input
                type={passwordVisibility ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder='Enter Password'
                tabIndex={4}
                required
              /> &nbsp;
              <Button id='password-button' type="button" onClick={togglePasswordVisibility}>
                {passwordVisibility ? 'Hide' : 'Show'}
              </Button>
            </div>
          </div>
          <br/>

          {/* Confirm Password Input */}
          <div>
            <label>Confirm Password</label>
            <br/>
            <input
              type={passwordVisibility ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder='Confirm Password'
              tabIndex={5}
              required
            />
          </div>
          {/* Passwords Match Validation */}
          {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <span id='password-alert'>Passwords must match!</span>
          )}
          <br/>
        </form>
      </Modal.Body>

      <Modal.Footer>
        {/* Close Button */}
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {/* Reset Button */}
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
        {/* Create Button */}
        <Button variant="primary" onClick={handleCreateButton}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateAccountModal;
