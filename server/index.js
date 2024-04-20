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

// calculates new time for pass
const addTime = async(duration, licensePlate) => {
  const fetchActivePassDuration = 'SELECT duration FROM Passes WHERE license = ? ORDER BY startTime DESC LIMIT 1';

  const results = await executeQuery(fetchActivePassDuration, [licensePlate]);
  console.log('Original time:', results);

  let newTime = duration + results;

  return newTime;
};

// Updates pass that is currently active
const updateLivePass = async(passData) => {
  let newTime = addTime(passData.duration, passData.licensePlate);

  const updatePass = 'UPDATE Passes SET duration = ? WHERE license = ?';

  const results = await executeQuery(updatePass, [newTime, passData.licensePlate]);
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

/* Routes */
app.post('/purchase-pass', purchasePass);
app.post('/pass-search', passSearch);
