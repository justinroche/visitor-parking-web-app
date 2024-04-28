import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './ParkingInfoModal.css';
import mapImage from './media/uwwmap.png';

// This modal is a DEMO component. Use it as a reference.
function CampusParkingInfoModal({ show, handleClose }) {
  function handleCloseButton() {
    handleClose();
  }

  // Render the modal.
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Visitor Parking on Campus</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="text-container">
            <h5>General Parking Information</h5>

            <p>
              Visitor parking passes are required 24/7 with the following
              exceptions:
            </p>
            <ul>
              <li>5 p.m. Fridays through 11 p.m. Sundays</li>
              <li>University recognized Holidays</li>
            </ul>
            <br />
            <p>
              Parking Enforcement uses License Plate Recognition software to
              enforce parking regulations, so it is important that you enter
              your license plate correctly when purchasing a pass.
            </p>
            <p>
              Visitor permits are valid in all commuter parking lots. However,
              permits are not valid in parking stalls with signs indicating
              "Restricted", "Reserved", "No Parking", or "Passport Metered
              Stalls".
            </p>
            <p>
              Overnight parking (between 2 a.m. and 5 a.m.) is permitted{' '}
              <strong>only in Lot 19</strong>.
            </p>
            <br />
            <h6>Rates</h6>
            <p>Daily visitor passes are $5.00 per day.</p>
            <p>Hourly visitor pass rates are as follows:</p>
            <ul>
              <li>1 hour - $1.65</li>
              <li>2 hours - $3.05</li>
              <li>3 hours - $4.45</li>
            </ul>
            <p>
              For passes longer than three hours, please purchase a daily pass.
            </p>
            <br />

            <h5>Map</h5>
            <p>
              Please refer to map below to determine which lots you may use
              (Visitor and Commuter parking)
            </p>
            <div className="campus-map-container">
              <img src={mapImage} className="campus-map" />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseButton}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CampusParkingInfoModal;
