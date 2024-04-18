const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const util = require('util');

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
    'INSERT INTO will_test (fname, lname, email, password) VALUES (?, ?, ?, ?)';

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

// Example usage of the function within an Express route
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

// Routes
// app.post('/account-settings', createAccount);
