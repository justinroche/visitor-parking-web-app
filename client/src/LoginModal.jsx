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

    const handleLogin = () => {
        // Perform login logic here
        console.log('Logging in with:', formData);
        handleClose();
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
                    <Button className='save-button' id='password-button' onClick={togglePasswordVisibility}>
                        {passwordVisibility ? 'Hide Password' : 'Show Password'}
                    </Button>
                </div>
                <br />

                {/* CreateAccountModal */}
                <p id='footer-text'>Don't have an account?&nbsp;&nbsp;<button type='button' onClick={handleOpenCreateAccountModal}>Register</button></p>
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
                    <Button className='save-button' variant="primary" onClick={handleLogin}>
                        Login
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}

export default LoginModal;
