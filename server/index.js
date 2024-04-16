const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'washington',
  user: 'rochejd20',
  password: 'jr1649',
  database: 'uww-visitor-parking',
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

// Middleware for handling database connection and error
const withDBConnection = (callback) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return callback(err, null);
    }
    callback(null, connection);
  });
};

// Function to execute SQL query
const executeQuery = (connection, query, values, callback) => {
  connection.query(query, values, (error, results) => {
    connection.release();
    if (error) {
      console.error('Error executing query:', error);
      return callback(error, null);
    }
    callback(null, results);
  });
};

// Function to handle POST request for purchasing pass
const purchasePass = (req, res) => {
  const data = req.body;
  console.log('Received:', data);

  const startTime = new Date();
  const durationHours =
    data.passLengthType === 'days'
      ? data.passLengthValue * 24
      : data.passLengthValue;

  const passData = {
    license: data.licensePlate,
    duration: durationHours,
    startTime: startTime,
  };

  withDBConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ message: 'Error connecting to database' });
    }

    const query =
      'INSERT INTO justin_passes_test (license, startTime, duration) VALUES (?, ?, ?)';
    const values = [passData.license, passData.startTime, passData.duration];

    executeQuery(connection, query, values, (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error executing query' });
      }
      console.log('Data inserted:', results);
      res.status(200).json({ message: 'purchase-pass data received!' });
    });
  });
};

// Routes
app.post('/purchase-pass', purchasePass);
