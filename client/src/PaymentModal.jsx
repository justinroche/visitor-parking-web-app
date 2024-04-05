import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';


function PaymentModal({ show, handleClose }) {
  // Send a POST request to the server when the modal is closed.
  function handleCloseButton() {
    axios
      .post('http://localhost:8080/payment-info', { data: 'modal closed' })
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
      .post('http://localhost:8080/payment-info', { data: 'modal saved' })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    handleClose();
  }

  // Render the modal.
  // the p $25.00 is just a temp place holder until we have the amount working
  // also not sure how we want to store the expiration date of the card, I just put MM/YY can be changed later
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Payment Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <h5>Total</h5>
      <p>$ 25.00</p> 

      <h5>Name on Card</h5>
      <form>
      <input type="text" id="textbox" name="textbox" placeholder="Enter a name"></input>
      </form>
      <br></br>

      <h5>Card Number</h5>
      <form>
      <input type="text" id="textbox" name="textbox" placeholder="1234 1234 1234 1234"></input>
      </form>
      <br></br>

      <h5>Expiration</h5>
      <form>
      <input type="text" id="textbox" name="textbox" placeholder="MM / YY"></input>
      </form>
      <br></br>

      <h5>CVC</h5>
      <form>
      <input type="text" id="textbox" name="textbox" placeholder="CVC"></input>
      </form>
      <br></br>

      </Modal.Body>
      <Modal.Footer>
        <div className="container d-flex justify-content-between">
          <Button className='modal-button' variant="primary" onClick={handleSaveButton}>
            Submit Payment
          </Button>
          <div>
            <Button style = {{marginRight: "5px"}}  variant="secondary" onClick={handleCloseButton}>
              Close
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default PaymentModal;