import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './CardInfoModal.css';
import AddCardInfoModal from './AddCardInfoModal';

function CardInfoModal({ show, handleClose }) {
  // AddCardInfoModal state
  const [addCardInfoModalVisible, setAddCardInfoModalVisible] = useState(false);

  // Function to handle opening AddCardInfoModal
  const handleOpenAddCardInfoModal = () => {
    setAddCardInfoModalVisible(true);
  };

  // Function to handle closing AddCardInfoModal
  const handleCloseAddCardInfoModal = () => {
    setAddCardInfoModalVisible(false);
  };

  // Send a POST request to the server when the modal is closed.
  function handleCloseButton() {
    axios
      .post('http://localhost:8080/card-info-modal', { data: 'modal closed' })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    handleClose();
  }

  // Send a POST request to the server when the modal is saved.
  function handleSaveButton() {
    axios
      .post('http://localhost:8080/card-info-modal', { data: 'modal saved' })
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
    <Modal show={show} onHide={handleCloseButton}>
      <Modal.Header closeButton>
        <Modal.Title>Card Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Credit Card Number text input */}
        <h5>Credit & Debit Cards</h5>
        <p>Card ending in "1234"</p>
        {/* Display last 4 digits of user's default card */}
        <p>First Name Last Name</p>
        {/* Display first name & last name of logged-in user's card (cardholder value) */}
       <p><button type='button'>Edit</button>&nbsp;button needs function</p> {/* Add a way to edit current card */}
        <br/>

        {/* AddCardInfoModal button */}
        <h5>Add a new payment method</h5>
        <button type='button' onClick={handleOpenAddCardInfoModal}>Add Card</button>

        {/* AddCardInfoModal */}
        <AddCardInfoModal
          show={addCardInfoModalVisible}
          handleClose={handleCloseAddCardInfoModal}
        />
        <br/><br/>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseButton}>
          Close
        </Button>
        <Button className='save-button' variant="primary" onClick={handleSaveButton}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CardInfoModal;
