import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function ReceiptModal({ show, handleClose, receiptData }) {
  const expirationDate = new Date(receiptData.expirationDate);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
          Thank you for your purchase!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Your pass expires at {expirationDate.toLocaleTimeString()} on{' '}
          {expirationDate.toLocaleDateString()}.
        </p>
        <p>
          Amount charged: $
          {receiptData.passCost ? receiptData.passCost.toFixed(2) : ''}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="primary-button"
          variant="primary"
          onClick={handleClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReceiptModal;
