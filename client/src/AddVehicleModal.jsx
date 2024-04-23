import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './AddVehicleModal.css';

function AddVehicleModal({ show, handleClose, userEmail }) {
  const [formData, setFormData] = useState({
    license: '',
    make: '',
    model: '',
    year: 0,
    email: userEmail,
  });

  // Handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to validate input fields for adding a vehicle
  const validateInput = (license, make, model, year) => {
    // Check if any of the fields are empty
    if (!license || !make || !model || !year) {
      return false;
    }
    return true;
  };

  // Inside the AddVehicleModal component

  // Handle form submission
  const handleCreateButton = async () => {
    const { license, make, model, year } = formData;

    // Validate inputs
    if (!validateInput(license, make, model, year)) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      // Create a new object with all form data and add userEmail to it
      const formDataWithUserEmail = {
        ...formData,
        email: userEmail, // Assign userEmail to the email field
      };

      // Post the formDataWithUserEmail to the backend
      await axios
        .post('http://localhost:8080/insert-vehicle', formDataWithUserEmail)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      // Success handling
      alert('Vehicle added successfully.');

      // Reset the form
      setFormData({
        license: '',
        make: '',
        model: '',
        year: 0,
        email: userEmail, // Reset email back to the logged-in user's email
      });

      // Close the modal
      handleClose();
    } catch (error) {
      console.error('Error:', error);

      // Error handling (e.g., notify the user)
      alert('Error inserting vehicle data');
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      license: '',
      make: '',
      model: '',
      year: 0,
      email: userEmail, // Reset email back to the logged-in user's email
    });
  };

  // Render the modal.
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Vehicles</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="form-group">
            <label>License</label>
            <input
              type="text"
              id="licenseInput"
              name="license"
              placeholder="License"
              value={formData.license}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Make</label>
            <input
              type="text"
              id="makeInput"
              name="make"
              placeholder="Make"
              value={formData.make}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Model</label>
            <input
              type="text"
              id="modelInput"
              name="model"
              placeholder="Model"
              value={formData.model}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Year</label>
            <input
              type="number"
              id="yearInput"
              name="year"
              placeholder="Year"
              value={formData.year}
              onChange={handleInputChange}
              required
            />
          </div>
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
        {/* Save & Add Button */}
        <Button
          className="save-button"
          variant="primary"
          onClick={handleCreateButton}
        >
          Save & Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddVehicleModal;
