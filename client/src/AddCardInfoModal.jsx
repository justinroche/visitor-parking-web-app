import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './AddCardInfoModal.css';

function AddCardInfoModal({ show, handleClose }) {
  // Initial form data state
  const initialFormData = {
    cardholderInfo: '', expDate: '', cvv: '', streetAddress: '', city: '', zipCode: '',
    country: '', cardNickname: '', cardInfo: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleCloseButton = () => {
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

  // Function to reset form data
  const handleResetButton = () => {
    setFormData(initialFormData);
  };

  return (
    <Modal show={show} onHide={handleCloseButton}>
      <Modal.Header closeButton>
        <Modal.Title>Card Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          {/* Credit Card Nickname */}
          <input
            type="text"
            id="cardNicknameInput"
            name="cardNickname"
            value={formData.cardNickname}
            placeholder="Card Nickname (e.g., Bank)"
            onChange={handleInputChange}
          />
          <br /><br />
          
          {/* Credit Card Number */}
          <input
            type="text"
            id="cardInfoInput"
            name="cardInfo"
            value={formData.cardInfo}
            placeholder="Card Number"
            onChange={handleInputChange}
          />
          <br /><br />
          
          {/* Cardholder Name */}
          <input
            type="text"
            name="cardholderInfo"
            value={formData.cardholderInfo}
            placeholder="Cardholder Name"
            onChange={handleInputChange}
          />
          <br /><br />
          
          {/* Expiration Date */}
          <input
            type="text"
            name="expDate"
            value={formData.expDate}
            placeholder="Expiration Date (MM/YY)"
            onChange={handleInputChange}
          />
          <br /><br />
          
          {/* CVV */}
          <input
            type="password"
            name="cvv"
            value={formData.cvv}
            placeholder="CVV (3 or 4 digit)"
            onChange={handleInputChange}
          />
          <br /><br />
          
          {/* Street Address */}
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            placeholder="Street Address"
            onChange={handleInputChange}
          />
          <br /><br />
          
          {/* City */}
          <input
            type="text"
            name="city"
            value={formData.city}
            placeholder="City"
            onChange={handleInputChange}
          />
          <br /><br />
          
          {/* Zip Code */}
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            placeholder="Zip Code"
            onChange={handleInputChange}
          />
          <br /><br />

          {/* State */}
          <select
                        name='state'
                        id='stateSelect'
                        value={formData.state}
                        onChange={handleInputChange}
                        className='wider-input'
                    >
                      <option value="" disabled selected>Select a state *</option>
                      <option value="alabama">Alabama (AL)</option>
                      <option value="alaska">Alaska (AK)</option>
                      <option value="arizona">Arizona (AZ)</option>
                      <option value="arkansas">Arkansas (AR)</option>
                      <option value="california">California (CA)</option>
                      <option value="colorado">Colorado (CO)</option>
                      <option value="connecticut">Connecticut (CT)</option>
                      <option value="delaware">Delaware (DE)</option>
                      <option value="florida">Florida (FL)</option>
                      <option value="georgia">Georgia (GA)</option>
                      <option value="hawaii">Hawaii (HI)</option>
                      <option value="idaho">Idaho (ID)</option>
                      <option value="illinois">Illinois (IL)</option>
                      <option value="indiana">Indiana (IN)</option>
                      <option value="iowa">Iowa (IA)</option>
                      <option value="kansas">Kansas (KS)</option>
                      <option value="kentucky">Kentucky (KY)</option>
                      <option value="louisiana">Louisiana (LA)</option>
                      <option value="maine">Maine (ME)</option>
                      <option value="maryland">Maryland (MD)</option>
                      <option value="massachusetts">Massachusetts (MA)</option>
                      <option value="michigan">Michigan (MI)</option>
                      <option value="minnesota">Minnesota (MN)</option>
                      <option value="mississippi">Mississippi (MS)</option>
                      <option value="missouri">Missouri (MO)</option>
                      <option value="montana">Montana (MT)</option>
                      <option value="nebraska">Nebraska (NE)</option>
                      <option value="nevada">Nevada (NV)</option>
                      <option value="newHampshire">New Hampshire (NH)</option>
                      <option value="newJersey">New Jersey (NJ)</option>
                      <option value="newMexico">New Mexico (NM)</option>
                      <option value="newYork">New York (NY)</option>
                      <option value="northCarolina">North Carolina (NC)</option>
                      <option value="northDakota">North Dakota (ND)</option>
                      <option value="ohio">Ohio (OH)</option>
                      <option value="oklahoma">Oklahoma (OK)</option>
                      <option value="oregon">Oregon (OR)</option>
                      <option value="pennsylvania">Pennsylvania (PA)</option>
                      <option value="rhodeIsland">Rhode Island (RI)</option>
                      <option value="southCarolina">South Carolina (SC)</option>
                      <option value="southDakota">South Dakota (SD)</option>
                      <option value="tennessee">Tennessee (TN)</option>
                      <option value="texas">Texas (TX)</option>
                      <option value="utah">Utah (UT)</option>
                      <option value="vermont">Vermont (VT)</option>
                      <option value="virginia">Virginia (VA)</option>
                      <option value="washington">Washington (WA)</option>
                      <option value="westVirginia">West Virginia (WV)</option>
                      <option value="wisconsin">Wisconsin (WI)</option>
                      <option value="wyoming">Wyoming (WY)</option>
                      <option value="other">Other</option>
                    </select>
                    <br/>


          {/* Country */}
          <select
            name="country"
            id="countrySelect"
            value={formData.country}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select a country</option>
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
          <br /><br />
          
          {/* Buttons */}
          <Button variant='secondary' onClick={handleCloseButton}>
            Close
          </Button>
          <Button variant='secondary' onClick={handleResetButton}>
            Reset
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