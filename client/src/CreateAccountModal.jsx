import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './CreateAccountModal.css';

// Function to validate email address
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

function CreateAccountModal({ show, handleClose }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [passwordVisibility, setPasswordVisibility] = useState(false);

    // Handle input change
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisibility(!passwordVisibility);
    };

    // Handle form submission
    const handleCreateButton = async () => {
        const { firstName, lastName, email, password, confirmPassword } = formData;

        // Validate inputs
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            alert('Please fill out all required fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        try {
            // Make POST request to create account
            const response = await axios.post('http://localhost:8080/create-account', formData);
            console.log('Account created:', response.data.message);

            // Notify the user of successful account creation
            alert('Account created successfully!');

            // Reset form and close modal
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
            });
            handleClose();
        } catch (error) {
            console.error('Error creating account:', error);
            alert('An error occurred while creating your account. Please try again.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create an Account</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <form>
                    {/* First Name Input */}
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Last Name Input */}
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-container">
                            <input
                                type={passwordVisibility ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <button type="button" onClick={togglePasswordVisibility}>
                                {passwordVisibility ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type={passwordVisibility ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
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
                {/* Create Button */}
                <Button variant="primary" onClick={handleCreateButton}>
                    Create
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateAccountModal;
