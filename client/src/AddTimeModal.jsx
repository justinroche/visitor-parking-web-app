import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './AddTimeModal';

function AddTimeModal({ show, handleClose }) {
  
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

  // handleInputChange updates the form data when the user edits an input field.
  /*function handleInputChange(event) {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  }*/

  // Render the modal.
  return (
    <Modal show={show} onHide={handleCloseButton}>
      <Modal.Header closeButton>
        <Modal.Title>Add Time</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <h5>How much time would you like to add?</h5>
        <br></br>
        <h6>Time Remaining</h6>
        <p>31:02</p>
        <br/>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseButton}>
          Close
        </Button>
        <Button className='save-button' variant="primary" onClick={handleSaveButton}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddTimeModal;
