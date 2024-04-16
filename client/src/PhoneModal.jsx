import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './PhoneModal.css'; // Adjust the path as needed

function PhoneModal({ show, handleClose }) {
    // State for form data and phone number validity
    const [formData, setFormData] = useState({ phone: '' });
    const [isPhoneValid, setIsPhoneValid] = useState(true);

    // Phone validation function
    function validatePhone(phone) {
        // Regular expression for validating a phone number in the format XXX-XXX-XXXX
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        return phoneRegex.test(phone);
    }

    // handleInputChange updates the form data when the user edits the input field
    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });

        // Validate the phone number
        if (name === 'phone') {
            const isValid = validatePhone(value);
            setIsPhoneValid(isValid);
        }
    }

    // handleSaveButton sends a POST request when the modal is saved
    function handleSaveButton() {
        if (isPhoneValid) {
            axios.post('http://localhost:8080/phone-number-modal', { data: formData.phone })
                .then(response => {
                    window.alert('Your phone number has been updated.');
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            handleClose();
        } else {
            window.alert('Please enter a valid phone number in the format XXX-XXX-XXXX.');
        }
    }

    // Render the modal
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Phone Number</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Phone Number</h5>
                <form>
                    <input 
                        type="tel"
                        id="phoneInput"
                        name="phone"
                        placeholder="Phone Number * (XXX-XXX-XXXX)"
                        value={formData.phone}
                        onChange={handleInputChange}
                        // Add the class to the input element
                        className="wider-input"
                    />
                    {!isPhoneValid && <p className="error-message">Please enter a valid phone number in the format: <br />XXX-XXX-XXXX.</p>}
                </form>
                <br />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSaveButton} disabled={!isPhoneValid}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PhoneModal;