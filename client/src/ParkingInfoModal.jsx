import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';


function ParkingInfoModal({ show, handleClose, handlePaymentModalOpen }) {
  // Send a POST request to the server when the modal is closed.
  function handleCloseButton() {
    axios
      .post('http://localhost:8080/parking-info', { data: 'modal closed' })
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
      .post('http://localhost:8080/parking-info', { data: 'modal saved' })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    handleClose();
  }

  function handlePayButton() {
    handlePaymentModalOpen();
    handleClose();
  }


  // Render the modal.
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Buy A Pass</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <h5>License plate number</h5>
      <form>
      <input type="text" id="textbox" name="textbox" placeholder="ABC-1234"></input>
      </form>
      <br></br>

      <h5>Saved Vehicles</h5>
      <select class = "vehicles" name="vehicles" id="vehicles">
        <option value="vehicle1">vehicle1</option>
        <option value="vehicle2">vehicle2</option>
        <option value="vehicle3">vehicle3</option>
      </select> 
      <br></br><br></br>

      <h5>Time</h5>
      <form>
      <input type="radio" id="option1" name="option" value="option1"></input>
      <label class = "radio" for="option1 "> Hourly</label>

      <input type="radio" id="option2" name="option" value="option2"></input>
      <label class = "radio" for="option2">Daily</label>

      <input type="radio" id="option3" name="option" value="option3"></input>
      <label class = "radio" for="option3">Weekly</label>
      </form>
      <br></br>

      <h5>Push Notifications</h5>
      <div>
        <input type="checkbox" id="push" name="notifiy"/>
        <label class = "notification" for="scales">Enable push notifications</label>
      </div>
      <select name="times" id="times">
        <option value="15min">15 min</option>
        <option value="30min">30 min</option>
        <option value="45min">45 min</option>
        <option value="60min">60 min</option>
      </select> 
      <form>
      <input class = "phone" type="text" id="textbox" name="textbox" placeholder="Enter your phone number"></input>
      </form>

      </Modal.Body>
      <Modal.Footer>
        <div className="container d-flex justify-content-between">
          <Button className='modal-button' variant="primary" onClick={handlePayButton}>
            Pay
          </Button>
          <div>
            <Button style = {{marginRight: "5px"}}  variant="secondary" onClick={handleCloseButton}>
              Close
            </Button>
            <Button className='modal-button' variant="primary" onClick={handleSaveButton}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default ParkingInfoModal;
