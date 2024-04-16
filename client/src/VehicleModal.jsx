import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './VehicleModal.css';
import AddVehicleModal from './AddVehicleModal';

function VehicleModal({ show, handleClose }) {
    // AddVehicleModal state
    const [addVehicleModalVisible, setAddVehicleModalVisible] = useState(false);

    // Function to handle opening AddVehicleModal
    const handleOpenAddVehicleModal = () => {
        setAddVehicleModalVisible(true);
    };

    // Function to handle closing AddVehicleModal
    const handleCloseAddVehicleModal = () => {
        setAddVehicleModalVisible(false);
    };

    // Send a POST request to the server when the modal is closed.
    function handleCloseButton() {
        axios.post('http://localhost:8080/vehicle-modal', { data: 'modal closed' })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        handleClose();
    }

    // Send a POST request to the server when the modal is saved.
    function handleSaveButton() {
        axios.post('http://localhost:8080/vehicle-modal', { data: 'modal saved' })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        handleClose();
    }

    // Render the modal.
    return (
        <Modal show={show} onHide={handleCloseButton}>
            <Modal.Header closeButton>
                <Modal.Title>Vehicles</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Vehicles</h5>
                <p>Registered vehicles appear here</p>
                <br/>

                <h5>Add a new vehicle</h5>
                {/* Add Vehicle button */}
                <Button variant="primary" onClick={handleOpenAddVehicleModal}>
                    Add Vehicle
                </Button>

                {/* AddVehicleModal */}
                <AddVehicleModal
                    show={addVehicleModalVisible}
                    handleClose={handleCloseAddVehicleModal}
                />
                <br/><br/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseButton}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSaveButton}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default VehicleModal;