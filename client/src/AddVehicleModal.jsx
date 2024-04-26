import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './AddVehicleModal.css';
import { serverURL } from './host.json';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';

function AddVehicleModal({
  show,
  handleClose,
  userEmail,
  fetchUserVehiclesInformation,
}) {
  const [formData, setFormData] = useState({
    license: '',
    make: '',
    model: '',
    year: '',
    email: userEmail,
  });

  const [alertMessage, setAlertMessage] = useState('');

  // Max length for license plate is 7 characters.
  useEffect(() => {
    if (formData.license.length > 7) {
      setFormData({
        ...formData,
        license: formData.license.substring(0, 7),
      });
    }
  }, [formData.license]);

  // Handle input change
  const handleInputChange = (event) => {
    let { name, value } = event.target;

    // Convert license plate to uppercase if it's the license plate input
    if (name === 'license') {
      value = value.toUpperCase();
    }
    setFormData({ ...formData, [name]: value });
  };

  // Function to validate input fields for adding a vehicle
  const validateInput = (license, make, model, year) => {
    setAlertMessage(''); // Clear previous alert message
    // Check if any of the fields are empty
    if (!license || !make || !model || !year) {
      setAlertMessage('Please fill out all required fields.');
      return false;
    }

    /* Verify license plate length */
    if (formData.license.length < 1 || formData.license.length > 7) {
      setAlertMessage(
        'Please enter a valid license plate (e.g., "123ABC" or "ABC1234").'
      );
      return;
    }

    if (isNaN(year) || year.length !== 4 || year < 1886 || year > 2024) {
      setAlertMessage('Please enter a valid year.');
      return false;
    }

    return true;
  };

  // Handle 'Enter' key press on the year input field
  const handleYearKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      handleCreateButton(); // Call handleCreateButton function
    }
  };

  // Handle form submission
  const handleCreateButton = async () => {
    const { license, make, model, year } = formData;

    // Validate inputs
    if (!validateInput(license, make, model, year)) {
      return;
    }

    try {
      setAlertMessage(''); // Clear previous alert message
      // Create a new object with all form data and add userEmail to it
      const formDataWithUserEmail = {
        ...formData,
        email: userEmail, // Assign userEmail to the email field
      };

      // Post the formDataWithUserEmail to the backend
      await axios
        .post(serverURL + '/insert-vehicle', formDataWithUserEmail)
        .then((response) => {
          fetchUserVehiclesInformation(userEmail);
        })
        .catch((error) => {
          console.error('Error:', error);
          setAlertMessage('Error adding vehicle.');
        });

      // Reset the form
      setFormData({
        license: '',
        make: '',
        model: '',
        year: '',
        email: userEmail, // Reset email back to the logged-in user's email
      });

      // Close the modal
      handleClose();
    } catch (error) {
      setAlertMessage('');
      console.error('Error:', error);

      // Error handling (e.g., notify the user)
      setAlertMessage('Error inserting vehicle data');
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      license: '',
      make: '',
      model: '',
      year: '',
      email: userEmail, // Reset email back to the logged-in user's email
    });
  };

  // Render the modal.
  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add a Vehicle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Alert */}
        {alertMessage && (
          <Alert style={{ marginBottom: '10px' }} severity="error">
            <AlertTitle>{alertMessage}</AlertTitle>
          </Alert>
        )}
        <div className="form-group">
          <h5 className='headers'>License Plate</h5>
          <br />
          <input
            type="text"
            id="licenseInput"
            name="license"
            placeholder="ABC1234"
            value={formData.license}
            onChange={handleInputChange}
            required
            tabIndex={1}
          />
          <br />
          <br />
        </div>
        <div className="form-group">
          <h5 className='headers'>Make</h5>
          <br />
          <input
            type="text"
            id="makeInput"
            name="make"
            placeholder="Enter Make"
            value={formData.make}
            onChange={handleInputChange}
            required
            tabIndex={2}
          />
          <br />
          <br />
        </div>
        <div className="form-group">
          <h5 className='headers'>Model</h5>
          <br />
          <input
            type="text"
            id="modelInput"
            name="model"
            placeholder="Enter Model"
            value={formData.model}
            onChange={handleInputChange}
            required
            tabIndex={3}
          />
          <br />
          <br />
        </div>
        <div className="form-group">
          <h5 className='headers'>Year</h5>
          <br />
          <input
            type="text"
            id="yearInput"
            name="year"
            placeholder="Enter Year"
            value={formData.year}
            onChange={handleInputChange}
            onKeyDown={handleYearKeyPress}
            required
            tabIndex={4}
          />
          <br />
          <br />
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        {/* Close and Reset Buttons */}
        <div>
          <Button
            variant="secondary"
            onClick={handleClose}
            id="add-vehicle-close"
          >
            Close
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {/* Add Button */}
        <Button
          className="save-button"
          variant="primary"
          onClick={handleCreateButton}
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddVehicleModal;
