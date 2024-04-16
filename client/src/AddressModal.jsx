import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './AddressModal.css'; // Adjust the path as needed

function AddressModal({ show, handleClose }) {
    // State for form data and form validation
    const [formData, setFormData] = useState({
        streetAddress: '',
        city: '',
        zipCode: '',
        state: '',
        country: '',
    });

    const [isFormValid, setIsFormValid] = useState(false);
    const [isZipCodeValid, setIsZipCodeValid] = useState(true);
    const [isOtherState, setIsOtherState] = useState(false);
    const [otherState, setOtherState] = useState('');

    // Validation function
    function validateForm() {
        // Required fields
        const { streetAddress, city, zipCode, state, country } = formData;
        // Check if all required fields are not empty
        const isValid = streetAddress && city && zipCode && state && country;
        setIsFormValid(isValid);
    }

    // Zip code validation function
    function validateZipCode(zipCode) {
        // Check if the zip code is a 5-digit number
        const zipCodeRegex = /^\d{5}$/;
        return zipCodeRegex.test(zipCode);
    }

    // Handle input changes
    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'state') {
            // Check if the "other" option is selected
            setIsOtherState(value === 'other');
            setFormData({ ...formData, state: value });
        }

        // Validate the zip code
        if (name === 'zipCode') {
            const isValid = validateZipCode(value);
            setIsZipCodeValid(isValid);
        }

        // Validate the form
        validateForm();
    }

    // Handle save button
    function handleSaveButton() {
        if (isFormValid && isZipCodeValid) {
            // Include the other state value if "other" is selected
            const dataToSend = { ...formData };
            if (isOtherState) {
                dataToSend.state = otherState;
            }

            axios.post('http://localhost:8080/demo-modal', { data: dataToSend })
                .then(response => {
                    window.alert('Your home address has been updated.');
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            handleClose();
        } else {
            window.alert('Please complete all required fields (street address, city, postal/zip code, state, and country).');
        }
    }

    // Handle reset button
    function handleResetButton() {
        setFormData({
            streetAddress: '',
            city: '',
            zipCode: '',
            state: '',
            country: '',
        });
        setIsOtherState(false);
        setOtherState('');
        setIsFormValid(false);
        setIsZipCodeValid(true);
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Home Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    {/* Street Address */}
                    <input
                        type='text'
                        id='streetAddressInput'
                        name='streetAddress'
                        placeholder='Street Address *'
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        className="wider-input"
                    />
                    <br/><br/>

                    {/* City */}
                    <input
                        type='text'
                        id='cityInput'
                        name='city'
                        placeholder='City *'
                        value={formData.city}
                        onChange={handleInputChange}
                        className="wider-input"
                    />
                    <br/><br/>

                    {/* Zip Code */}
                    <input
                        type='text'
                        id='zipCodeInput'
                        name='zipCode'
                        placeholder='Postal / Zip Code *'
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="wider-input"
                    />
                    {/* Display an error message if the zip code is invalid */}
                    {!isZipCodeValid && (
                        <p className='error-message'>
                            Please enter a valid 5-digit postal/zip code.
                        </p>
                    )}
                    <br/><br/>

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

                    {/* If other option for state is selected */}
                    {isOtherState && (
                        <input
                            type='text'
                            id='otherStateInput'
                            name='otherState'
                            placeholder='Enter other state name'
                            value={otherState}
                            onChange={(e) => setOtherState(e.target.value)}
                            className='wider-input'
                        />
                    )}
                    <br/>

                    {/* Country */}
                    <select
                        name='country'
                        id='countrySelect'
                        value={formData.country}
                        onChange={handleInputChange}
                        className='wider-input'
                    >
                        <option value='' disabled selected>Select a country *</option>
                        <option value='unitedStates'>United States (US)</option>
                        <option value='canada'>Canada (CA)</option>
                        <option value='unitedKingdom'>United Kingdom (UK)</option>
                        <option value='australia'>Australia (AU)</option>
                        <option value='germany'>Germany (DE)</option>
                        <option value='france'>France (FR)</option>
                        <option value='japan'>Japan (JP)</option>
                        <option value='china'>China (CN)</option>
                        <option value='india'>India (IN)</option>
                        <option value='brazil'>Brazil (BR)</option>
                    </select>  
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={handleClose}>
                    Close
                </Button>
                <Button variant='secondary' onClick={handleResetButton}>
                    Reset
                </Button>
                <Button variant='primary' onClick={handleSaveButton} disabled={!isFormValid || !isZipCodeValid}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddressModal;