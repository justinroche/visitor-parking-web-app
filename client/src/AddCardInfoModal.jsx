import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './AddCardInfoModal.css';

function AddCardInfoModal({ show, handleClose }) {
  const [formData, setFormData] = useState({
    cardholderInfo: '', expDate: '', cvv: '', streetAddress: '',
    city: '', zipCode: '', country: ''
  });

  const handleCloseButton = () => {
    // Handle any necessary actions before closing the modal
    handleClose();
  };

  const handleSaveButton = () => {
    // Send form data to the server
    axios
      .post('http://localhost:8080/card-info', formData)
      .then((response) => {
        console.log(response.data);
        handleClose();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSaveButton();
  };

  return (
    <Modal show={show} onHide={handleCloseButton}>
      <Modal.Header closeButton>
        <Modal.Title>Card Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          
          {/* Credit Card Number */}
          <input
            type="text"
            id='cardInfoInput'
            name="cardInfo"
            value={formData.cardholderInfo}
            placeholder="Card Number"
            onChange={handleInputChange}
          />
          <br/><br/>
          {/* Cardholder Name */}
          <input
            type="text"
            name="cardholderInfo"
            value={formData.cardholderInfo}
            placeholder="Cardholder Name"
            onChange={handleInputChange}
          />
          <br/><br/>
          {/* Expiration Date */}
          <input
            type="text"
            name="expDate"
            value={formData.expDate}
            placeholder="Expiration Date"
            onChange={handleInputChange}
          />
          <br/><br/>
          {/* CVV */}
          <input
            type="password"
            name="cvv"
            value={formData.cvv}
            placeholder="CVV (3 or 4 digit)"
            onChange={handleInputChange}
          />
          <br/><br/>
          {/* Street Address */}
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            placeholder="Street Address"
            onChange={handleInputChange}
          />
          <br/><br/>
          {/* City */}
          <input
            type="text"
            name="city"
            value={formData.city}
            placeholder="City"
            onChange={handleInputChange}
          />
          <br/><br/>
          {/* Zip Code */}
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            placeholder="Zip Code"
            onChange={handleInputChange}
          />
          <br/><br/>
          {/* Country */}
          <select name='country' id='countrySelect' value={formData.country}>
            <option value="" disabled selected>Select a country</option>
            <option value="unitedStates">United States (US)</option>
            <option value="canada">Canada (CA)</option>
            <option value="unitedKingdom">United Kingdom (UK)</option>
            <option value="australia">Australia (AU)</option>
            <option value="germany">Germany (DE)</option>
            <option value="france">France (FR)</option>
            <option value="japan">Japan (JP)</option>
            <option value="china">China (CN)</option>
            <option value="india">India (IN)</option>
            <option value="brazil">Brazil (BR)</option>
          </select>
          <br/><br/>
          {/* Submit button */}
          <Button variant='secondary' onClick={handleCloseButton}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save & Add
        </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default AddCardInfoModal;
