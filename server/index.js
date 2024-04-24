const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const util = require('util');
const moment = require('moment');
const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(cors());

app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'washington.uww.edu',
  user: 'rochejd20',
  password: 'jr1649',
  database: 'uww-visitor-parking',
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

const queryAsync = util.promisify(pool.query).bind(pool);

// Asynchronous query function with error handling
const executeQuery = async (query, values) => {
  try {
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

const insertVehicleData = async (userData) => {
  const insertionQuery =
    'INSERT INTO Vehicles (license, make, model, year, email) VALUES (?, ?, ?, ?, ?)';

  const values = [
    userData.license,
    userData.make,
    userData.model,
    userData.year,
    userData.email,
  ];
  const results = await executeQuery(insertionQuery, values);
  console.log('User vehicle inserted:', results);
  return results;
};

app.post('/insert-vehicle', async (req, res) => {
  const userData = req.body;

  console.log(userData);

  try {
    await insertVehicleData(userData);
    res.status(200).json({ message: 'User vehicle successfully inserted' });
  } catch (error) {
    console.error('Error inserting user vehicle:', error);
    res.status(500).json({ message: 'Error inserting user vehicle' });
  }
});

// Endpoint to fetch user's vehicles based on email
app.post('/get-user-vehicles', async (req, res) => {
  const { email } = req.body; // Extract email from request body

  // Query to fetch vehicles based on email
  const query = 'SELECT * FROM Vehicles WHERE email = ?';

  try {
    const results = await executeQuery(query, [email]);
    res.status(200).json({ vehicles: results });
  } catch (error) {
    console.error('Error fetching user vehicles:', error);
    res.status(500).json({ message: 'Error fetching user vehicles' });
  }
});

// Endpoint to delete a vehicle
app.delete('/delete-vehicle/:licensePlate', async (req, res) => {
  const licensePlate = req.params.licensePlate; // Extract license plate from request parameters

  // Query to delete vehicle based on license plate
  const deleteQuery = 'DELETE FROM Vehicles WHERE license = ?';

  try {
    await executeQuery(deleteQuery, [licensePlate]);
    res.status(200).json({ message: 'Vehicle successfully deleted' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ message: 'Error deleting vehicle' });
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

// calculates new time for pass
const addTimeFromLicense = async (duration, licensePlate) => {
  const fetchActivePassDuration =
    'SELECT duration FROM Passes WHERE license = ? ORDER BY startTime DESC LIMIT 1';

  const results = await executeQuery(fetchActivePassDuration, [licensePlate]);
  console.log('Original time:', results[0].duration);

  let newTime = parseInt(duration) + results[0].duration;

  return newTime;
};

// Updates pass that is currently active
const updateLivePass = async (passData) => {
  let newTime = await addTimeFromLicense(passData.duration, passData.license);
  console.log('New time:', newTime);

  const updatePass =
    'UPDATE Passes SET duration = ? WHERE license = ? ORDER BY startTime DESC LIMIT 1';

  const results = await executeQuery(updatePass, [newTime, passData.license]);
  console.log('Updated info:', results);

  return results;
};

// Insert a pass into the database
const insertPass = async (passData) => {
  let passInsertionQuery;
  let values;

  if (passData.notifyEnabled) {
    passInsertionQuery =
      'INSERT INTO Passes (license, startTime, duration, email, notifyEnabled, notifyWhen) VALUES (?, ?, ?, ?, ?, ?)';
    values = [
      passData.license,
      passData.startTime,
      passData.duration,
      passData.email,
      passData.notifyEnabled,
      passData.notifyWhen,
    ];
  } else if (passData.email) {
    passInsertionQuery =
      'INSERT INTO Passes (license, startTime, duration, email, notifyEnabled) VALUES (?, ?, ?, ?, ?)';
    values = [
      passData.license,
      passData.startTime,
      passData.duration,
      passData.email,
      passData.notifyEnabled,
    ];
  } else {
    passInsertionQuery =
      'INSERT INTO Passes (license, startTime, duration, notifyEnabled) VALUES (?, ?, ?, ?)';
    values = [
      passData.license,
      passData.startTime,
      passData.duration,
      passData.notifyEnabled,
    ];
  }
  const results = await executeQuery(passInsertionQuery, values);
  console.log('Pass inserted:', results);
  return results;
};

// Calculate and return the start time and duration of the provided pass
const preparePurchasePassData = (data) => {
  const startTime = new Date();
  const durationHours =
    data.passLengthType === 'days'
      ? data.passLengthValue * 24
      : data.passLengthValue;

  if (data.notificationsEnabled) {
    return {
      license: data.licensePlate,
      duration: durationHours,
      startTime: startTime,
      email: data.email,
      notifyEnabled: true,
      notifyWhen: data.notificationTime,
    };
  }

  if (data.email) {
    return {
      license: data.licensePlate,
      duration: durationHours,
      startTime: startTime,
      email: data.email,
      notifyEnabled: false,
    };
  }

  return {
    license: data.licensePlate,
    duration: durationHours,
    startTime: startTime,
    notifyEnabled: false,
  };
};

// Calculate the end time of a pass based on its start time and duration
const calculatePassEndTime = (startTime, duration) => {
  const passEndTime = new Date(startTime);
  passEndTime.setHours(passEndTime.getHours() + duration);
  return passEndTime;
};

// Return if a license plate has a live pass
const livePassExists = async (licensePlate) => {
  const fetchMostRecentPassQuery =
    'SELECT * FROM Passes WHERE license = ? ORDER BY startTime DESC LIMIT 1';

  const results = await executeQuery(fetchMostRecentPassQuery, [licensePlate]);

  // If a pass exists and the current time is before the pass end time, return true
  if (results.length > 0) {
    const mostRecentPass = results[0];
    const currentTime = new Date();
    const passEndTime = calculatePassEndTime(
      mostRecentPass.startTime,
      mostRecentPass.duration
    );
    return currentTime < passEndTime;
  }
  return false;
};

// Fetch pass information for a live pass
const fetchLivePassInformation = async (licensePlate) => {
  const livePass = await livePassExists(licensePlate);
  if (!livePass) {
    return null;
  }

  const fetchPassInfoQuery =
    'SELECT * FROM Passes WHERE license = ? ORDER BY startTime DESC LIMIT 1';
  const results = await executeQuery(fetchPassInfoQuery, [licensePlate]);
  return results.length > 0 ? results[0] : null;
};

// Check and process a pass insertion
const purchasePass = async (req, res) => {
  /* In practice, we would verify and charge the user's card here.
  For the purposes of this project, we assume the entered card information is valid. */

  // Prepare data for insertion
  const data = req.body;
  console.log('Purchase pass initiated. Received:', data);
  const passData = preparePurchasePassData(data);

  // If a live pass exists for the license plate, let the front end know so it can ask the user if they would like to add time to their pass.
  const livePass = await livePassExists(data.licensePlate);
  if (livePass) {
    console.log('Live pass already exists... responding to front end.');
    //alert("This plate number already has an active pass, if you would like to add more time continue as normal.");
    console.log(passData);
    await updateLivePass(passData);
    return res.status(200).json({ message: 'Live pass exists' });
  }

  console.log('Inserting pass...');
  await insertPass(passData);
  return res.status(200).json({ message: 'Pass successfully inserted' });
};

// Search for a live pass
const passSearch = async (req, res) => {
  const licensePlate = req.body.licensePlate;
  console.log('Pass search initiated. Received:', licensePlate);

  // Fetch pass information
  const passInfo = await fetchLivePassInformation(licensePlate);
  if (passInfo) {
    passInfo.endTime = calculatePassEndTime(
      passInfo.startTime,
      passInfo.duration
    );
    console.log('Found live pass:', passInfo);
    return res.status(200).json({ message: 'Live pass exists', passInfo });
  } else {
    console.log('No live pass exists... responding to front end.');
    return res.status(200).json({ message: 'Pass information not found' });
  }
};

const addTime = async (req, res) => {
  const passData = req.body;
  console.log('Add time initiated. Received:', passData);

  const addHours =
    passData.passLengthType === 'days'
      ? passData.passLengthValue * 24
      : passData.passLengthValue;
  const passID = passData.passID;

  try {
    // Call the addTimeToPass stored procedure
    await executeQuery('CALL addTimeToPass(?, ?)', [addHours, passID]);
    return res.status(200).json({ message: 'Time successfully added' });
  } catch (error) {
    console.error('Error adding time:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while adding time' });
  }
};

const getAvailability = async (req, res) => {
  const maxLivePasses = 100;

  const results = await executeQuery('CALL getCurrentPasses()', []);
  const availability = maxLivePasses - results[0].length;
  res.status(200).json({ availability: availability });
};

/* Routes */
app.post('/purchase-pass', purchasePass);
app.post('/pass-search', passSearch);
app.post('/add-time', addTime);
app.get('/availability', getAvailability);

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
