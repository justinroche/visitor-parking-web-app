import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './AddressModal';

function AddressModal({ show, handleClose }) {
  
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
        <Modal.Title>Update Home Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        {/* Street Address */}
        <h5>Address</h5>
        <form>
            <input
            type='text'
            id='streetAddressInput'
            name='streetAddress'
            placeholder='Street Address'
            //value={formData.streetAddress}
            onChange={handleInputChange}
            />
        </form>
        <br/>
        {/* Street Address 2 */}
        <form>
            <input
            type='text'
            id='streetAddress2Input'
            name='streetAddress2'
            placeholder='Street Address 2'
            //value={formData.streetAddress2}
            onChange={handleInputChange}
            />
        </form>
        <br/>
        {/* City */}
        <form>
            <input
            type='text'
            id='cityInput'
            name='city'
            placeholder='City'
            //value={formData.city}
            onChange={handleInputChange}
            />
        </form>
        <br/>
        {/* Region */}
        <form>
            <input
            type='text'
            id='regionInput'
            name='region'
            placeholder='Region'
            //value={formData.region}
            onChange={handleInputChange}
            />
        </form>
        <br/>
        {/* Zip Code */}
        <form>
            <input
            type='text'
            id='zipCodeInput'
            name='zipCode'
            placeholder='Postal / Zip Code'
            //value={formData.zipCode}
            onChange={handleInputChange}
            />
        </form>
        <br/>
        {/* Country */}
          <select name='country' id='countrySelect'>
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

export default AddressModal;
