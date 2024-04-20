import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './AccountSettingsModal.css';
import EmailModal from './EmailModal';
import PhoneModal from './PhoneModal';
import PasswordModal from './PasswordModal';
import AddressModal from './AddressModal';
import CardInfoModal from './CardInfoModal';
import VehicleModal from './VehicleModal';

/* React Bootstrap has a whole system for handling forms: https://react-bootstrap.netlify.app/docs/forms/overview/
We might want to rewrite this to fit their outline in the future, but this works well enough for now. */
function AccountSettingsModal({ show, handleClose, isLoggedIn }) {
    /* State */

    // EmailModal
    const [emailModalVisible, setEmailModalVisible] = useState(false);
    // Function to handle opening EmailModal
    const handleOpenEmailModal = () => {
      setEmailModalVisible(true);
    };
    // Function to handle closing EmailModal
    const handleCloseEmailModal = () => {
      setEmailModalVisible(false);
    };

     // PasswordModal
     const [passwordModalVisible, setPasswordModalVisible] = useState(false);
     // Function to handle opening PasswordModal
     const handleOpenPasswordModal = () => {
       setPasswordModalVisible(true);
     };
     // Function to handle closing passwordModal
     const handleClosePasswordModal = () => {
       setPasswordModalVisible(false);
     };

    // PhoneModal
    const [phoneModalVisible, setPhoneModalVisible] = useState(false);
    // Function to handle opening PhoneModal
    const handleOpenPhoneModal = () => {
      setPhoneModalVisible(true);
    };
    // Function to handle closing PhoneModal
    const handleClosePhoneModal = () => {
      setPhoneModalVisible(false);
    };

    // AddressModal
    const [addressModalVisible, setAddressModalVisible] = useState(false);
    // Function to handle opening AddressModal
    const handleOpenAddressModal = () => {
      setAddressModalVisible(true);
    };
    // Function to handle closing AddressModal
    const handleCloseAddressModal = () => {
      setAddressModalVisible(false);
    };

    // VehicleModal
    const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
    // Function to handle opening VehicleModal
    const handleOpenVehicleModal = () => {
      setVehicleModalVisible(true);
    };
    // Function to handle closing VehicleModal
    const handleCloseVehicleModal = () => {
      setVehicleModalVisible(false);
    };

    // CardInfoModal
    const [cardInfoModalVisible, setCardInfoModalVisible] = useState(false);
    // Function to handle opening CardInfoModal
    const handleOpenCardInfoModal = () => {
      setCardInfoModalVisible(true);
    };
    // Function to handle closing CardInfoModal
    const handleCloseCardInfoModal = () => {
      setCardInfoModalVisible(false);
    };

    // formData contains all information entered and sent to the backend.
    const [formData, setFormData] = useState({
      fName: '', lName: '', email: '', password: '', phone: '',
      licensePlate: '', carModel: '', carYear: '', carColor: '',
      cardInfo: '', cardholderInfo: '', expDate: '', cvv: '',
      streetAddress: '', city: '', zipCode: '', country: '',
    });
  
    /* Handlers */
  
    // handlePayButton sends the relevant form data to the backend when the user clicks the pay button.
    function handleCreateButton() {
      // If any required fields are missing, prevent form submission.
      if (!formData.fName || !formData.lName || !formData.email || !formData.password
        || !formData.phone || !formData.licensePlate || !formData.carModel || !formData.carYear
        || !formData.carColor || !formData.cardInfo || !formData.cardholderInfo || !formData.expDate
        || !formData.cvv || !formData.streetAddress || !formData.city || !formData.zipCode || !formData.country) {
        alert('Please fill out all required fields before submitting.');
        return;
      }
  
      // Prepare data to be sent to the backend.
      const dataToSend = {
        fName: formData.fName, lName: formData.lName, email: formData.email,
        password: formData.password, phone: formData.phone, licensePlate: formData.licensePlate,
        carModel: formData.carModel, carYear: formData.carYear, carColor: formData.carColor,
        cardInfo: formData.cardInfo, cardholderInfo: formData.cardholderInfo, expDate: formData.expDate,
        cvv: formData.cvv, streetAddress: formData.streetAddress, city: formData.city,
        zipCode: formData.zipCode, country: formData.country,
      };
  
      // Send the data to the backend.
      axios
        .post('http://localhost:8080/account-settings', dataToSend)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  
      handleClose();
    }
  
    // Render the modal.
    return (
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Account Settings</Modal.Title>
        </Modal.Header>
  
        <Modal.Body>
    
          {/* EmailModal */}
          <button type='button' onClick={handleOpenEmailModal}>Email Address</button>
          <EmailModal
            show={emailModalVisible}
            handleClose={handleCloseEmailModal}
          />
          <br/><br/>

          {/* PasswordModal */}
          <button type='button' onClick={handleOpenPasswordModal}>Password</button>
          <PasswordModal
            show={passwordModalVisible}
            handleClose={handleClosePasswordModal}
          />
          <br/><br/>

          {/* PhoneModal */}
          <button type='button' onClick={handleOpenPhoneModal}>Phone Number</button>
          <PhoneModal
            show={phoneModalVisible}
            handleClose={handleClosePhoneModal}
          />
          <br/><br/>

          {/* AddressModal */}
          <button type='button' onClick={handleOpenAddressModal}>Address</button>
          <AddressModal
            show={addressModalVisible}
            handleClose={handleCloseAddressModal}
          />
          <br/><br/>

          {/* VehicleModal */}
          <button type='button' onClick={handleOpenVehicleModal}>Vehicles</button>
          <VehicleModal
            show={vehicleModalVisible}
            handleClose={handleCloseVehicleModal}
          />
          <br/><br/>

          {/* CardInfoModal */}
          <button type='button' onClick={handleOpenCardInfoModal}>Card Information</button>
          <CardInfoModal
            show={cardInfoModalVisible}
            handleClose={handleCloseCardInfoModal}
          />
          <br/><br/>

        </Modal.Body>
        <Modal.Footer>
          <div className="container d-flex justify-content-between">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button className='save-button' variant="primary" onClick={handleCreateButton}>
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
  export default AccountSettingsModal;
