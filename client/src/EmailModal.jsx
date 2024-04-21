import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './EmailModal.css'; // Adjust the path as needed

function EmailModal({ show, handleClose }) {
    const [formData, setFormData] = useState({ email: '' });
    const [isEmailValid, setIsEmailValid] = useState(true);
    
    useEffect(() => {
        // Fetch the current user's email data from the server
        axios.get('http://localhost:8080/email-data')
            .then(response => {
                const emailData = response.data[0]?.email; // Assuming you want the first email only
                setFormData({ email: emailData });
            })
            .catch(error => {
                console.error('Error fetching email data:', error);
            });
    }, []);
    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        
        if (name === 'email') {
            const isValid = validateEmail(value);
            setIsEmailValid(isValid);
        }
    }

    function handleSaveButton() {
        if (isEmailValid) {
            // Send a POST request to update the email
            axios.post('http://localhost:8080/update-email', { email: formData.email })
                .then(response => {
                    window.alert('Your email address has been updated successfully.');
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error updating email:', error);
                    window.alert('Error updating email. Please try again later.');
                });
            handleClose();
        } else {
            window.alert('Please enter a valid email address.');
        }
    }

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
                        name="email"
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={isEmailValid ? '' : 'invalid-input'}
                    />
                    {!isEmailValid && <p className="error-message">Please enter a valid email address.</p>}
                </form>
                <br />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSaveButton} disabled={!isEmailValid}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EmailModal;

 