import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './PhoneModal';

function PhoneModal({ show, handleClose }) {
  // Send a POST request to the server when the modal is closed.
  function handleCloseButton() {
    axios
      .post('http://localhost:8080/demo-modal', { data: 'modal closed' })
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
      .post('http://localhost:8080/demo-modal', { data: 'modal saved' })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    handleClose();
  }

  // handleInputChange updates the form data when the user edits an input field.
  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  }

  // Render the modal.
  return (
    <Modal show={show} onHide={handleCloseButton}>
      <Modal.Header closeButton>
        <Modal.Title>Update Phone Number</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <h5>Phone Number</h5>
        <form>
          <input 
            type='phone'
            id='phoneInput'
            name='phone'
            placeholder='Phone Number *' //Need to display current phone num that's connected with the account, could be null if never added previously
            //value={formData.email}
            onChange={handleInputChange}
          />
        </form>
        <br/>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseButton}>
          Close
        </Button>
        <Button className='save-button' variant="primary" onClick={handleSaveButton}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PhoneModal;
