import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './EmailModal.css'; // Adjust the path as needed

function EmailModal({ show, handleClose }) {
    // State for form data and email validity
    const [formData, setFormData] = useState({ email: '' });
    const [isEmailValid, setIsEmailValid] = useState(true);
    
    // Email validation function
    function validateEmail(email) {
        // Regular expression for validating an email address
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // handleInputChange updates the form data when the user edits the input field
    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        
        // Validate the email address
        if (name === 'email') {
            const isValid = validateEmail(value);
            setIsEmailValid(isValid);
        }
    }

    // handleSaveButton sends a POST request when the modal is saved
    function handleSaveButton() {
        if (isEmailValid) {
            axios.post('http://localhost:8080/email-modal', { data: formData.email })
                .then(response => {
                    window.alert('Your email address has been updated.');
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            handleClose();
        } else {
            window.alert('Please enter a valid email address.');
        }
    }

    // Render the modal
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Email Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Email</h5>
                <form>
                    <input 
                        type="email"
                        id="emailInput"
                        name="email"
                        placeholder="Email Address *" 
                        value={formData.email}
                        onChange={handleInputChange}
                        // Add a class if the email is invalid (for styling purposes)
                        className={isEmailValid ? '' : 'invalid-input'}
                    />
                    {/* Add a message or highlight the input field if the email is invalid */}
                    {!isEmailValid && <p className="error-message">Please enter a valid email address.</p>}
                </form>
                <br />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                {/* Disable the Update button if the email is invalid */}
                <Button variant="primary" onClick={handleSaveButton} disabled={!isEmailValid}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EmailModal;