import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './PasswordModal.css';

function PasswordModal({ show, handleClose }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordsMatch(e.target.value === confirmNewPassword);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
    setPasswordsMatch(e.target.value === newPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword === confirmNewPassword) {
      // Passwords match, proceed with saving the new password
      // You can add your logic here, e.g., call an API to save the new password
      console.log('Password updated successfully');
      handleClose();
    } else {
      // Passwords don't match, display an error message
      alert('Passwords must match');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  // Send a POST request to the server when the modal is closed.
  function handleCloseButton() {
    axios
      .post('http://localhost:8080/email-modal', { data: 'modal closed' })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    handleClose();
  }

  // Send a POST request to the server when the modal is saved.
  function handleSaveButton() {
    axios
      .post('http://localhost:8080/email-modal', { data: 'modal saved' })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Password */} {/* Look into add feature of user entering in previous password before being able to update it. */}
        <h5>Password</h5>
        <form onSubmit={handleSubmit}>
          <div>
            <label>New Password:</label>
            &nbsp;&nbsp;
            <input
              type={passwordVisibility ? 'text' : 'password'}
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            <br/><br/>
          </div>
          <div>
            <label>Confirm New Password:</label>
            &nbsp;&nbsp;
            <input
              type={passwordVisibility ? 'text' : 'password'}
              value={confirmNewPassword}
              onChange={handleConfirmNewPasswordChange}
            />
          </div>
          {!passwordsMatch && <p id='warning-text'>Passwords must match *</p>}
        </form>
        <br />
        <Button id='password-button' onClick={togglePasswordVisibility}>
          {passwordVisibility ? 'Hide Password' : 'Show Password'}
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseButton}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveButton}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PasswordModal;