import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, FormControl, Button, Spinner, Modal } from 'react-bootstrap';
import './PassSearchModal.css';

function PassSearchModal({ show, handleClose }) {
  const [plateSearch, setPlateSearch] = useState('');
  const [endTime, setEndTime] = useState('');
  const [passExists, setPassExists] = useState(false);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plateSearch.length > 7) {
      setPlateSearch(plateSearch.substring(0, 7));
    }
  }, [plateSearch]);

  function handleSearchChange(event) {
    setPlateSearch(event.target.value.toUpperCase());
  }

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    await axios
      .post('http://localhost:8080/pass-search', {
        licensePlate: plateSearch,
      })
      .then((response) => {
        setPlateSearch('');
        if (response.data.message === 'Pass information not found') {
          setPassExists(false);
        } else {
          setPassExists(true);
          setEndTime(
            new Date(response.data.passInfo.endTime).toLocaleTimeString(
              'en-US',
              {
                timeStyle: 'medium',
              }
            ) +
              ' on ' +
              new Date(response.data.passInfo.endTime).toLocaleDateString()
          );
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        setSearched(true);
        setLoading(false);
      });
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Search for an Existing Pass</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form onSubmit={handleSearchSubmit}>
              <FormControl
                type="text"
                id="passSearchInput"
                placeholder="Enter a license plate"
                value={plateSearch}
                onChange={handleSearchChange}
              />
              <Button variant="primary" type="submit" id="passSearchButton">
                Search
              </Button>
            </Form>
            <div id="passSearchResults">
              {loading && <Spinner animation="border" variant="primary" />}
              {searched && passExists && !loading && (
                <>
                  <p>✅ Pass found.</p>
                  <p>Pass ends at {endTime}.</p>
                </>
              )}
              {searched && !passExists && !loading && (
                <p>❌ No pass found for this vehicle.</p>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PassSearchModal;
