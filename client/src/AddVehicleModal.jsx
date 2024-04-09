import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './AddVehicleModal.css';

function AddVehicleModal({ show, handleClose }) {
  const [formData, setFormData] = useState({
    carModel: '',
    carYear: '',
    carColor: '',
    licensePlate: ''
  });

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
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSaveButton();
  };

  // Render the modal.
  return (
    <Modal show={show} onHide={handleCloseButton}>
      <Modal.Header closeButton>
        <Modal.Title>Add Vehicles</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>New Vehicle</h5>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            id='carModelInput'
            name='carModel'
            placeholder='Car Model'
            value={formData.carModel}
            onChange={handleInputChange}
          />
          <br/><br/>
          <input
            type='number'
            id='carYearInput'
            name='carYear'
            placeholder='Car Year'
            value={formData.carYear}
            onChange={handleInputChange}
          />
          <br/><br/>
          <select name='carColor' id='carColorSelect'>
            <option value="" disabled selected>Select a color</option>
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="silver">Silver</option>
            <option value="gray">Gray</option>
            <option value="blue">Blue</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
            <option value="orange">Orange</option>
            <option value="brown">Brown</option>
            <option value="beige">Beige</option>
            <option value="gold">Gold</option>
            <option value="bronze">Bronze</option>
            <option value="purple">Purple</option>
            <option value="pink">Pink</option>
          </select>
          <br/><br/>
          <input
            type='text'
            id='licensePlateInput'
            name='licensePlate'
            placeholder='ABC-1234'
            value={formData.licensePlate}
            onChange={handleInputChange}
          />
          <br/>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCloseButton}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save & Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddVehicleModal;

