import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './CreateAccountModal.css';

function CreateAccountModal({ show, handleClose, isLoggedIn }) {
    /* State */
    const [formData, setFormData] = useState({
        fName: '', lName: '', email: '', password: '', phone: '',
        licensePlate: '', carModel: '', carYear: '', carColor: '',
        cardInfo: '', cardholderInfo: '', expDate: '', cvv: '',
        streetAddress: '', city: '', zipCode: '', country: '',
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

    const handleCreateButton = () => {
        // If any required fields are missing, prevent form submission.
        const requiredFields = ['fName', 'lName', 'email', 'password', 'phone', 'licensePlate', 'carModel', 'carYear', 'carColor', 'cardInfo', 'cardholderInfo', 'expDate', 'cvv', 'streetAddress', 'city', 'zipCode', 'country'];
        if (requiredFields.some(field => !formData[field])) {
            alert('Please fill out all required fields before submitting.');
            return;
        }

        // Prepare data to be sent to the backend.
        const dataToSend = { ...formData };

        // Send the data to the backend.
        axios.post('http://localhost:8080/purchase-pass', dataToSend)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        handleClose();
    };

    /* Render */
    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Create an Account</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* First name text input */}
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
                {/* Last name text input */}
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
                {/* Email input */}
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
                {/* Password input */}
                <h5>Password</h5>
                <div className="password-input-container">
                    <input
                        type={passwordVisibility ? 'text' : 'password'}
                        id='passwordInput'
                        name='password'
                        placeholder='Password *'
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    &nbsp;&nbsp;
                    <Button className='save-button' variant="primary" id='password-button' onClick={togglePasswordVisibility}>
                        {passwordVisibility ? 'Hide' : 'Show'}
                    </Button>
                </div>
                <br />
                <h8>* indicates required field to fill out.</h8>
            </Modal.Body>

            <Modal.Footer>
                <div className="container d-flex justify-content-between">
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button className='save-button' variant="primary" onClick={handleCreateButton}>
                        Create
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateAccountModal;
