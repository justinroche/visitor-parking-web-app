import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './CreateAccountModal.css';

// Function to validate email address
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

function CreateAccountModal({ show, handleClose }) {
    // State variables
    const [formData, setFormData] = useState({
        fName: '', lName: '', email: '', password: '', confirmPassword: ''
    });
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [isPasswordStarted, setIsPasswordStarted] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Handlers
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        // Update form data
        setFormData({ ...formData, [name]: value });

        // When user starts typing in password, confirmation input opens
        if (name === 'password' && value.length > 0) {
            setIsPasswordStarted(true);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisibility(!passwordVisibility);
    };

    // Handle form submission
    const handleCreateButton = () => {
        // If any required fields are missing, prevent form submission
        const requiredFields = ['fName', 'lName', 'email', 'password', 'confirmPassword'];
        if (requiredFields.some(field => !formData[field])) {
            alert('Please fill out all required fields before submitting.');
            return;
        }

        // Check if password and confirmPassword match
        if (formData.password !== formData.confirmPassword) {
            alert('Password and Confirm Password do not match. Please try again.');
            return;
        }

        // Validate email address
        if (!validateEmail(formData.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Notify the user of successful account creation
        alert('Your account has been registered successfully.');

        // Close modal
        handleClose();
    };

    // Function to reset form data
    const handleResetButton = () => {
        setFormData({
            fName: '', lName: '', email: '', password: '', confirmPassword: ''
        });
        setIsPasswordStarted(false);
        setPasswordVisibility(false);
    };

    // Render
    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Create an Account</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Form fields */}
                <h5>First Name</h5>
                <form>
                    <input
                        type='text'
                        id='fNameInput'
                        name='fName'
                        placeholder='First name *'
                        value={formData.fName}
                        onChange={handleInputChange}
                    />
                </form>
                <br />
                <h5>Last Name</h5>
                <form>
                    <input
                        type='text'
                        id='lNameInput'
                        name='lName'
                        placeholder='Last name *'
                        value={formData.lName}
                        onChange={handleInputChange}
                    />
                </form>
                <br />
                <h5>Email</h5>
                <form>
                    <input
                        type='email'
                        id='emailInput'
                        name='email'
                        placeholder='Email Address *'
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </form>
                <br />
                <h5>Choose Password</h5>
                <div className="password-input-container">
                    <input
                        type={passwordVisibility ? 'text' : 'password'}
                        id='passwordInput'
                        name='password'
                        placeholder='Choose Password *'
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    <Button variant="primary" id='password-button' onClick={togglePasswordVisibility}>
                        {passwordVisibility ? 'Hide' : 'Show'}
                    </Button>
                </div>
                <br />
                {isPasswordStarted && (
                    <>
                        <h5>Confirm Password</h5>
                        <div className="password-input-container">
                            <input
                                type={passwordVisibility ? 'text' : 'password'}
                                id='confirmPasswordInput'
                                name='confirmPassword'
                                placeholder='Confirm Password *'
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                    </>
                )}
                <h6 id='error-message'>* indicates required field to fill out.</h6>
            </Modal.Body>

            <Modal.Footer>
                <div className="container d-flex justify-content-between">
                    {/* Close button */}
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {/* Reset button */}
                    <Button variant="secondary" onClick={handleResetButton}>
                        Reset
                    </Button>
                    {/* Create button */}
                    <Button variant="primary" onClick={handleCreateButton}>
                        Create
                    </Button>
                </div>
                {/* Display confirmation message */}
                {formSubmitted && (
                    <div className="confirmation-message">
                        Your account has been registered successfully.
                    </div>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default CreateAccountModal;