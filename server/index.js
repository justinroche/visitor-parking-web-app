/* Import backend libraries */
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const util = require('util');
const moment = require('moment');
const cors = require('cors');

const nodemailer = require('nodemailer');
const cron = require('node-cron');

const dbCredentials = require('./dbCredentials.json');
const nmCredentials = require('./nmCredentials.json');

/* Initialize transporter to send email notifications */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: nmCredentials.user,
    pass: nmCredentials.password,
  },
});

/* Initialize the Express app */
const app = express();
const PORT = 8080;
app.use(cors());
app.use(bodyParser.json());

/* Connection pool */
const pool = mysql.createPool({
  host: dbCredentials.host,
  user: dbCredentials.user,
  password: dbCredentials.password,
  database: dbCredentials.db,
});

/* separate connection for notifications, as using the pool was causing a bug not allowing the database to be
used properly. */
const connection = mysql.createConnection({
  host: dbCredentials.host,
  user: dbCredentials.user,
  password: dbCredentials.password,
  database: dbCredentials.db,
});

/* Scheduling function, gets called every 1 minute */
cron.schedule('* */1 * * * *', () => {
  // calls getCurrentNotify() stored procedure and stores values into results
  let sqlQuery = `CALL getCurrentNotify()`;
  // runs query and returns a list of the results
  connection.query(sqlQuery, [false], (error, results, fields) => {
    if (error) return console.error(error.message);

    // loop to parse the results and check if it is time to send notifications
    for (let i = 0; i < results[0].length; i++) {
      let parsedResult = JSON.parse(JSON.stringify(results[0]));
      let passID = parsedResult[i].passID;
      let license = parsedResult[i].license;
      let startTime = parsedResult[i].startTime;
      let duration = parsedResult[i].duration;
      let email = parsedResult[i].email;
      let notifyWhen = parsedResult[i].notifyWhen;
      startTime = new Date(startTime);
      const currentDate = new Date(Date.now());
      let endTime = new Date(startTime.getTime() + duration * 60000 * 60);
      let notifyTime = new Date(endTime.getTime() - notifyWhen * 60000);
      let expiryTime = notifyWhen;

      // check to see if notification should be sent yet, and adjusts the email message accordingly
      if (notifyTime - currentDate <= 0) {
        const mailOptions = {
          from: 'uwwparkingpassnotify@gmail.com',
          to: email,
          subject: 'UWW Visitor Parking Pass Expiry Notice',
          html:
            '<p>Hello, your visitor parking pass for ' +
            license +
            ' will expire in ' +
            expiryTime +
            ' minutes ' +
            '(Pass ID: ' +
            passID +
            ')</p>',
        };
        // disables further notifications after notification is initially sent
        connection.query(
          'UPDATE Passes SET notifyEnabled = 0 WHERE passID = ' + passID + ';',
          [false],
          (error, results, fields) => {
            if (error) return console.error(error.message);
            console.log('Email notification sent for passID: ' + passID);
          }
        );

        //sends mail using the transporter
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) console.log(err);
          // sends email notification and marks pass as no longer needing a notification to be sent.
          else console.log(info);
          notifiedPasses.push(passID);
        });
      }
    }
  });
});

/* Listen for Endpoints */
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

const queryAsync = util.promisify(pool.query).bind(pool);

/* Asynchronous query function with error handling */
const executeQuery = async (query, values) => {
  try {
    const results = await queryAsync(query, values);
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

/* Query to create a new user in the database */
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

const emailExists = async (email) => {
  const query = 'SELECT * FROM Accounts WHERE email = ?';
  try {
    const results = await executeQuery(query, [email]);
    return results.length > 0;
  } catch (error) {
    console.error('Error checking email:', error);
    return true;
  }
};

/* Endpoint to create a new user */
const insertUserCall = async (req, res) => {
  const userData = req.body;

  try {
    if (await emailExists(userData.email)) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    await insertUserData(userData);
    res.status(200).json({ message: 'User data successfully inserted' });
  } catch (error) {
    console.error('Error inserting user data:', error);
    res.status(500).json({ message: 'Error inserting user data' });
  }
};

/* Endpoint to log in a user */
const loginUserCall = async (req, res) => {
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
};

/* Query to insert a user's vehicle */
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

/* Endpoint to insert a user's vehicle */
const insertVehicleCall = async (req, res) => {
  const userData = req.body;

  try {
    await insertVehicleData(userData);
    res.status(200).json({ message: 'User vehicle successfully inserted' });
  } catch (error) {
    console.error('Error inserting user vehicle:', error);
    res.status(500).json({ message: 'Error inserting user vehicle' });
  }
};

// Endpoint to fetch user's vehicles based on email
const getUserVehicles = async (req, res) => {
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
};

/* Endpoint to delete a vehicle */
const deleteVehicle = async (req, res) => {
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
};

/* Determine if a given pass is live */
const isPassLive = (pass) => {
  // Extract startTime and duration from the pass object
  const { startTime, duration } = pass;

  // Calculate the end time of the pass by adding duration hours to startTime
  const endTime = moment(startTime).add(duration, 'hours');

  // Check if the current time is between startTime and endTime
  return moment().isBetween(startTime, endTime);
};

/* Endpoint to fetch a user's live passes */
const fetchUserPasses = async (req, res) => {
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
};

/* Calculate and return the new time for a live pass */
const addTimeFromLicense = async (duration, licensePlate) => {
  const fetchActivePassDuration =
    'SELECT duration FROM Passes WHERE license = ? ORDER BY startTime DESC LIMIT 1';

  const results = await executeQuery(fetchActivePassDuration, [licensePlate]);

  console.log('Original time:', results[0].duration);

  let newTime = parseInt(duration) + results[0].duration;

  return newTime;
};

/* Query to add time to a live pass */
const updateLivePass = async (passData) => {
  let newTime = await addTimeFromLicense(passData.duration, passData.license);
  console.log('New time:', newTime);

  const updatePass =
    'UPDATE Passes SET duration = ? WHERE license = ? ORDER BY startTime DESC LIMIT 1';

  const results = await executeQuery(updatePass, [newTime, passData.license]);
  console.log('Updated info:', results);

  return results;
};

/* Queries to insert a pass into the database */
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

/* Calculate and return the necessary data of the provided pass */
const preparePurchasePassData = (data) => {
  const startTime = new Date();
  const durationHours =
    data.passLengthType === 'days'
      ? data.passLengthValue * 24
      : data.passLengthValue;

  let passData = {
    license: data.licensePlate,
    duration: durationHours,
    startTime: startTime,
    notifyEnabled: data.notificationsEnabled ? true : false,
  };

  if (data.email) {
    passData.email = data.email;
  }

  if (data.notificationsEnabled) {
    passData.notifyWhen = data.notificationTime;
  }

  return passData;
};

/* Calculate the end time of a pass based on its start time and duration */
const calculatePassEndTime = (startTime, duration) => {
  const passEndTime = new Date(startTime);
  passEndTime.setTime(passEndTime.getTime() + duration * 3600 * 1000);
  return passEndTime;
};

/* Query to determine if a live pass exists for a given license plate */
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
    if (currentTime < passEndTime) {
      return results[0];
    }
    return false;
  }
  return false;
};

/* Query to fetch the most recent pass under a given license plate */
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

/* Endpoint to purchase a pass */
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

    const livePassData = {
      passID: livePass.passID,
      license: passData.license,
      expirationDate: calculatePassEndTime(
        livePass.startTime,
        livePass.duration
      ),
      cost: data.passCost,
      passLengthType: data.passLengthType,
      passLengthValue: data.passLengthValue,
      duration: passData.duration,
    };

    return res.status(200).json({ message: 'Live pass exists', livePassData });
  }

  console.log('Inserting pass...');

  try {
    await insertPass(passData);

    const receiptData = {
      expirationDate: calculatePassEndTime(
        passData.startTime,
        passData.duration
      ),
      passCost: data.passCost,
    };

    return res
      .status(200)
      .json({ message: 'Pass successfully inserted', receiptData });
  } catch (error) {
    console.log('Error inserting pass:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while inserting pass' });
  }
};

const confirmAddTime = async (req, res) => {
  const passData = req.body.livePassData;
  console.log('Confirm add time initiated. Received:', passData);
  try {
    await updateLivePass(passData);

    const receiptData = {
      expirationDate: calculatePassEndTime(
        passData.expirationDate,
        passData.duration
      ),
      passCost: passData.cost,
    };

    return res
      .status(200)
      .json({ message: 'Time successfully added', receiptData });
  } catch (error) {
    console.error('Error adding time:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while adding time' });
  }
};

/* Endpoint to search for a live pass */
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

/* Endpoint to add time to a pass */
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
    const updatedPass = await executeQuery(
      'SELECT * FROM Passes WHERE passID = ?',
      [passID]
    );

    const receiptData = {
      expirationDate: calculatePassEndTime(
        updatedPass[0].startTime,
        updatedPass[0].duration
      ),
      passCost: passData.passCost,
    };

    return res
      .status(200)
      .json({ message: 'Time successfully added', receiptData });
  } catch (error) {
    console.error('Error adding time:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while adding time' });
  }
};

/* Endpoint to get the number of live passes */
const getAvailability = async (req, res) => {
  const maxLivePasses = 100;

  const results = await executeQuery('CALL getCurrentPasses()', []);
  const availability = maxLivePasses - results[0].length;
  res.status(200).json({ availability: availability });
};

/* Routes */
app.get('/availability', getAvailability);
app.post('/purchase-pass', purchasePass);
app.post('/pass-search', passSearch);
app.post('/add-time', addTime);
app.post('/insert-user', insertUserCall);
app.post('/login-user', loginUserCall);
app.post('/insert-vehicle', insertVehicleCall);
app.post('/passes', fetchUserPasses);
app.post('/get-user-vehicles', getUserVehicles);
app.post('/confirm-add-time', confirmAddTime);
app.delete('/delete-vehicle/:licensePlate', deleteVehicle);
