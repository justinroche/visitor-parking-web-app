import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './PurchasePassModal.css';
import { Form, FormControl, Button, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';



function PassSearchForm() {
  const [plateSearch, setPlateSearch] = useState('');
  const [endTime, setEndTime] = useState('');
  const [passExists, setPassExists] = useState(false);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (plateSearch.length > 7) {
      setPlateSearch(plateSearch.substring(0, 7));
    }
  }, [plateSearch]);

  const handleSearchChange = (event) => {
    setPlateSearch(event.target.value.toUpperCase());
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8080/pass-search', {
        licensePlate: plateSearch,
      });
      setPlateSearch('');
      if (response.data.message === 'Pass information not found') {
        setPassExists(false);
      } else {
        setPassExists(true);
        setEndTime(new Date(response.data.passInfo.endTime).toLocaleString());
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Form id="passSearchForm" onSubmit={handleSearchSubmit}>
        <h3>Search for an Existing Pass</h3>
        <div id="passSearchInputContainer">  
        <FormControl
          className="passSearchInput"
          type="text"
          placeholder="   Enter a license plate"
          value={plateSearch}
          onChange={handleSearchChange}
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
              
        
        </div>
        
        <Button className="passSearchButton" variant="primary" type="submit" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Search'}
        
        </Button>
      
      </Form>
      <div id="passSearchResults" className="mt-3">
        {error && <Alert variant="danger">{error}</Alert>}
        {searched && passExists && !loading && (
          <Alert variant="success">
            <p>✅ Pass found</p>
            <p>Pass ends at {endTime}</p>
          </Alert>
        )}
        {searched && !passExists && !loading && (
          <Alert variant="warning">❌ No pass found</Alert>
        )}
      </div>
    </div>
  );
}

export default PassSearchForm;
