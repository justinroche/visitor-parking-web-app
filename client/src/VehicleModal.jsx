import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './VehicleModal.css';
import AddVehicleModal from './AddVehicleModal';

function VehicleModal({ show, handleClose, userEmail }) {
  const [vehicles, setVehicles] = useState([]);
  const [addVehicleModalVisible, setAddVehicleModalVisible] = useState(false);

  // Function to fetch user's vehicles information
  const fetchUserVehiclesInformation = async (email) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/get-user-vehicles',
        { email }
      );
      setVehicles(response.data.vehicles);
    } catch (error) {
      console.error('Error fetching user vehicles information:', error);
    }
  };

  // Fetch user's vehicles when the component mounts or when the modal is opened
  useEffect(() => {
    if (show) {
      fetchUserVehiclesInformation(userEmail);
    }
  }, [show, userEmail]);

  // Function to handle opening AddVehicleModal
  const handleOpenAddVehicleModal = () => {
    setAddVehicleModalVisible(true);
  };

  // Function to handle closing AddVehicleModal
  const handleCloseAddVehicleModal = () => {
    setAddVehicleModalVisible(false);
  };

  // Function to delete a vehicle
  const handleDeleteVehicle = async (license) => {
    try {
      await axios.delete(`http://localhost:8080/delete-vehicle/${license}`);
      // After successful deletion, fetch updated user's vehicles
      fetchUserVehiclesInformation(userEmail);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  // Render the modal.
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Vehicles</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Display user's vehicles */}
        {vehicles.length === 0 && <h5>No saved vehicles</h5>}
        {vehicles.length > 0 && (
          <>
            <h5>Your Vehicles</h5>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>License Plate</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle, index) => (
                    <tr key={vehicle.license}>
                      <td>{vehicle.license}</td>
                      <td>{vehicle.make}</td>
                      <td>{vehicle.model}</td>
                      <td>{vehicle.year}</td>
                      <td>
                        <Button
                          className="delete-button"
                          variant="secondary"
                          onClick={() => handleDeleteVehicle(vehicle.license)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="add-button"
          type="button"
          onClick={handleOpenAddVehicleModal}
        >
          Add Vehicle
        </Button>
        {/* AddVehicleModal */}
        <AddVehicleModal
          show={addVehicleModalVisible}
          handleClose={handleCloseAddVehicleModal}
          userEmail={userEmail}
          fetchUserVehiclesInformation={fetchUserVehiclesInformation}
        />
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default VehicleModal;
