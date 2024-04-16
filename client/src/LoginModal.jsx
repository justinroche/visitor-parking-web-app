import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './LoginModal.css';
import CreateAccountModal from './CreateAccountModal';

function LoginModal({ show, handleClose, isLoggedIn }) {
    /* State */
    const [createAccountModalVisible, setCreateAccountModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    /* Handlers */
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const togglePasswordVisibility = () => {
        setPasswordVisibility(!passwordVisibility);
    };

    const handleOpenCreateAccountModal = () => {
        setCreateAccountModalVisible(true);
    };

    const handleCloseCreateAccountModal = () => {
        setCreateAccountModalVisible(false);
    };

    const handleLogin = async () => {
        // Validate email and password
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        if (formData.password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }
    
        try {
            // Make API request to login
            const response = await axios.post('/api/login', formData);
            
            if (response.status === 200) {
                // Successful login
                alert('Login successful!');
                handleClose(); // Close the modal on successful login
                isLoggedIn(); // Call the prop function to update the login state
            } else {
                // Handle different response status codes
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again later.');
        }
    };
    

    

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Email input */}
                <form>
                    <input
                        type='email'
                        id='emailInput'
                        name='email'
                        placeholder='Email Address'
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </form>
                <br />

                {/* Password input */}
                <div>
                    <input
                        type={passwordVisibility ? 'text' : 'password'}
                        id='passwordInput'
                        name='password'
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    &nbsp;&nbsp;
                    <Button id='password-button' onClick={togglePasswordVisibility}>
                        {passwordVisibility ? 'Hide' : 'Show'}
                    </Button>
                </div>
                <br />

                {/* CreateAccountModal */}
                <p id='footer-text'>Don't have an account?&nbsp;&nbsp;
                    <Button id='register-button' variant="primary" onClick={handleOpenCreateAccountModal}>
                        Register
                    </Button>
                </p>

                <CreateAccountModal
                    show={createAccountModalVisible}
                    handleClose={handleCloseCreateAccountModal}
                />
                <br /><br />
            </Modal.Body>

            <Modal.Footer>
                <div className="container d-flex justify-content-between">
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleLogin}>
                        Login
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}

export default LoginModal;