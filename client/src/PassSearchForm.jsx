import React, { useState } from 'react';
import axios from 'axios';
import { Form, FormControl, Button } from 'react-bootstrap';

function PassSearchForm() {
  const [plateSearch, setPlateSearch] = useState('');
  const [endTime, setEndTime] = useState('');
  const [passExists, setPassExists] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearchChange = (event) => {
    setPlateSearch(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    await axios
      .post('http://localhost:8080/pass-search', {
        licensePlate: plateSearch,
      })
      .then((response) => {
        console.log(response);
        if (response.data.message === 'Pass information not found') {
          console.log('no pass found');
          setPassExists(false);
        } else {
          console.log('pass found');
          setPassExists(true);
          setEndTime(new Date(response.data.passInfo.endTime).toLocaleString());
        }
        setSearched(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <>
      <Form inline="true" onSubmit={handleSearchSubmit}>
        <FormControl
          type="text"
          placeholder="Search for an existing pass"
          value={plateSearch}
          onChange={handleSearchChange}
        />
        <br />
        <Button variant="outline-primary" type="submit">
          Search
        </Button>
      </Form>
      <br />
      {searched && passExists && <p>✅ Pass ends at {endTime}</p>}
      {searched && !passExists && <p>❌ No pass found</p>}
    </>
  );
}

export default PassSearchForm;
