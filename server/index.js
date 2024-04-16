const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// Create a connection pool
const pool = mysql.createPool({
  host: 'washington',
  user: 'rochejd20',
  password: 'jr1649',
  database: 'uww-visitor-parking',
});

// Create an express app instance.
const app = express();
const PORT = 8080;

// Enable cross-origin resource sharing for all routes.
app.use(cors());

// Middleware to parse JSON bodies.
app.use(bodyParser.json());

// The server will listen for incoming HTTP requests on port 8080.
app.listen(PORT, () => {
  console.log('Server listening on port 8080...');
});

// GET request example.
app.get('/example', (req, res) => {
  res.send('Hello from the server!');
});

// POST request example from the demo modal.
app.post('/demo-modal', (req, res) => {
  console.log('We just received', req.body.data, 'from the client.');
  res.send("Hey, it's the server. We received your button press.");
});

// POST request example from the demo modal.
app.post('/parking-info', (req, res) => {
  console.log('We just received', req.body.data, 'from the client.');
  res.send("Hey, it's the server. We received your button press.");
});

/* Post request when a user purchases a pass */
// TODO: Check for existing pass and process appropriately.
app.post('/purchase-pass', (req, res) => {
  const data = req.body;
  console.log('Received:', data);

  /* Insert into database */
  // Get the current timestamp for startTime
  const startTime = new Date();

  // Compute pass duration in hours based on passLengthType and passLengthValue
  let durationHours;
  if (data.passLengthType === 'days') {
    durationHours = data.passLengthValue * 24;
  } else {
    durationHours = data.passLengthValue;
  }

  // Create the data object to be inserted into the database
  const passData = {
    license: data.licensePlate,
    duration: durationHours,
    startTime: startTime,
  };

  // Store data to database
  pool.getConnection((err, connection) => {
    // Handle connection error
    if (err) {
      console.error('Error connecting to database:', err);
      res.status(500).json({ message: 'Error connecting to database' });
      return;
    }

    // Insert query
    const query =
      'INSERT INTO justin_passes_test (license, startTime, duration) VALUES (?, ?, ?)';

    // Process insertion
    connection.query(
      query,
      [passData.license, passData.startTime, passData.duration],
      (error, results) => {
        connection.release();

        // Handle query error and send an error response
        if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ message: 'Error executing query' });
          return;
        }

        // Send a success response
        res.status(200).json({ message: 'purchase-pass data received!' });
      }
    );
  });
});
