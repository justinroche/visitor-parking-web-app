const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const util = require('util');
const moment = require('moment');

const app = express();
const PORT = 8080;

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'washington.uww.edu',
  user: 'anthoneywj22',
  password: 'wa4385',
  database: 'uww-visitor-parking',
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

const executeQuery = async (query, values) => {
  try {
    const queryAsync = util.promisify(pool.query).bind(pool);
    const results = await queryAsync(query, values);
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

const insertUserData = async (userData) => {
  const insertionQuery =
    'INSERT INTO Accounts (firstName, lastName, email, password) VALUES (?, ?, ?, ?)';

  const values = [
    userData.firstName,
    userData.lastName,
    userData.email,
    userData.password,
  ];
  const results = await executeQuery(insertionQuery, values);
  console.log('User data inserted:', results);
  return results;
};

app.post('/insert-user', async (req, res) => {
  const userData = req.body;

  console.log(userData);

  try {
    await insertUserData(userData);
    res.status(200).json({ message: 'User data successfully inserted' });
  } catch (error) {
    console.error('Error inserting user data:', error);
    res.status(500).json({ message: 'Error inserting user data' });
  }
});

app.post('/login-user', async (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM Accounts WHERE email = ?';
  try {
    const results = await executeQuery(query, [email]);
    if (results.length === 0) {
      // User not found
      return res.status(401).json({ message: 'User not found' });
    }
    const user = results[0];
    if (password !== user.password) {
      // Passwords don't match
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Login successful
    console.log(`User logged in: ${user.email}`);
    res.status(200).json({ message: 'Login successful', userData: user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Function to check if a pass is live
function isPassLive(pass) {
  // Extract startTime and duration from the pass object
  const { startTime, duration } = pass;

  // Calculate the end time of the pass by adding duration hours to startTime
  const endTime = moment(startTime).add(duration, 'hours');

  // Check if the current time is between startTime and endTime
  return moment().isBetween(startTime, endTime);
}

// Endpoint to fetch passes based on email
app.post('/passes', async (req, res) => {
  const { email } = req.body; // Extract email from request body

  // Query to fetch passes based on email
  const query = 'SELECT * FROM Passes WHERE email = ?';

  try {
    const results = await executeQuery(query, [email]);

    if (results.length === 0) {
      // No passes found for the provided email
      return res.status(200).json({ message: 'No passes found' });
    }

    // Filter live passes
    const livePasses = results.filter((pass) => isPassLive(pass));

    res.status(200).json({ passes: livePasses });
  } catch (error) {
    console.error('Error fetching passes:', error);
    res.status(500).json({ message: 'Error fetching passes' });
  }
});

/* Fetch user information template ////////////////////////////
app.post('/get-user-data', async (req, res) => {
  const { column } = req.body;
  const query = 'SELECT * FROM table WHERE column = ?';
  try {
    const results = await executeQuery(query, [column]);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});
*/
