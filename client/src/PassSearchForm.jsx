import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, FormControl, Button, Spinner } from 'react-bootstrap';
import './PassSearchForm.css';

function PassSearchForm() {
  const [plateSearch, setPlateSearch] = useState('');
  const [endTime, setEndTime] = useState('');
  const [passExists, setPassExists] = useState(false);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Max length for license plate is 7 characters.
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
    setLoading(true); // Set loading when search starts

    await axios
      .post('http://localhost:8080/pass-search', {
        licensePlate: plateSearch,
      })
      .then((response) => {
        console.log(response);
        setPlateSearch(''); // Clear the search input after search
        if (response.data.message === 'Pass information not found') {
          setPassExists(false);
        } else {
          setPassExists(true);
          setEndTime(new Date(response.data.passInfo.endTime).toLocaleString());
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        setSearched(true); // Set searched to true when search completes
        setLoading(false); // Set loading to false when search completes
      });
  };

  return (
    <>
      <Form id="passSearchForm" onSubmit={handleSearchSubmit}>
        <h6>Search for an existing pass</h6>
        <FormControl
          id="passSearchInput"
          type="text"
          placeholder="Enter a license plate"
          value={plateSearch}
          onChange={handleSearchChange}
        />
        <Button id="passSearchButton" variant="outline-primary" type="submit">
          Search
        </Button>
      </Form>
      <div id="passSearchResults">
        {loading && <Spinner animation="border" variant="primary" />}
        {searched && passExists && !loading && (
          <>
            <p>✅ Pass found</p>
            <p>Pass ends at {endTime}</p>
          </>
        )}
        {searched && !passExists && !loading && <p>❌ No pass found</p>}
      </div>
    </>
  );
}

export default PassSearchForm;
