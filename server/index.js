const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const util = require('util');

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

// Promisify pool.getConnection
const getConnectionAsync = util.promisify(pool.getConnection).bind(pool);

// Promisify connection.query
const queryAsync = util.promisify(pool.query).bind(pool);

const withDBConnection = async (callback) => {
  let connection;
  try {
    connection = await getConnectionAsync();
    return await callback(connection);
  } catch (err) {
    console.error('Error connecting to database:', err);
    throw err;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const executeQuery = async (query, values) => {
  try {
    const results = await queryAsync(query, values);
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

const insertPass = async (passData) => {
  // Query to insert pass data into the database
  const passInsertionQuery =
    'INSERT INTO justin_passes_test (license, startTime, duration) VALUES (?, ?, ?)';
  const values = [passData.license, passData.startTime, passData.duration];

  try {
    const results = await executeQuery(passInsertionQuery, values);
    console.log('Data inserted:', results);
    return results;
  } catch (error) {
    throw error;
  }
};

const preparePurchasePassData = (data) => {
  // Calculate and return the start time and duration of the pass
  const startTime = new Date();
  const durationHours =
    data.passLengthType === 'days'
      ? data.passLengthValue * 24
      : data.passLengthValue;

  return {
    license: data.licensePlate,
    duration: durationHours,
    startTime: startTime,
  };
};

const livePassExists = async (licensePlate) => {
  // Query to fetch the most recent pass for the license plate
  const fetchMostRecentPassQuery =
    'SELECT * FROM justin_passes_test WHERE license = ? ORDER BY startTime DESC LIMIT 1';

  try {
    const results = await executeQuery(fetchMostRecentPassQuery, [
      licensePlate,
    ]);

    // If a pass exists and the current time is before the pass end time, return true
    if (results.length > 0) {
      const mostRecentPass = results[0];
      const currentTime = new Date();
      const passEndTime = new Date(mostRecentPass.startTime);
      passEndTime.setHours(passEndTime.getHours() + mostRecentPass.duration);
      return currentTime < passEndTime;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

const purchasePass = async (req, res) => {
  /* In practice, we would verify and charge the user's card here.
  For the purposes of this project, we assume the entered card information is valid. */

  try {
    // Prepare data for insertion
    const data = req.body;
    console.log('Received:', data);
    const passData = preparePurchasePassData(data);

    // If a live pass exists for the license plate, let the front end know so it can ask the user if they would like to add time to their pass.
    const livePass = await withDBConnection(async (connection) => {
      return await livePassExists(data.licensePlate, connection);
    });
    if (livePass) {
      return res.status(200).json({ message: 'Live pass exists' });
    }

    // Insert pass into database
    await withDBConnection(async (connection) => {
      await insertPass(passData, connection);
    });
    return res.status(200).json({ message: 'Pass successfully inserted' });
  } catch (err) {
    console.error('Error in purchasePass:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Routes
app.post('/purchase-pass', purchasePass);
