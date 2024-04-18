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
  user: 'anthoneywj22',
  password: 'wa4385',
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

const insertAccount = async (passData) => {
    const accountInsertionQuery = 'INSERT INTO will_test (fname, lname, email, password) VALUES (?, ?, ?, ?)';
    const values = [passData.fname, passData.lname, passData.email, passData.password];

    try {
        const results = await executeQuery(accountInsertionQuery, values);
        console.log('Data inserted:', results);
        return results;
    }
    catch (error) {
        throw error;
    }
};

const prepareCreateAccount = (data) => {

    return {
        fname: data.fname,
        lname: data.lname,
        email: data.email,
        password: data.password,
    };
};

const createAccount = async (req, res) => {

    try {
        const data = req.body;
        console.log('Received:', data);
        const createAccount = prepareCreateAccount(data);

        // insert create account into db
        await withDBConnection(async (connection) => {
            await insertAccount(passData, connection);
        });
        return res.status(200).json({ message: 'Account successfully inserted'});
    }
    catch {
        console.error('Error in createAccount', err);
        return res.status(500).json({ message: 'Internal server error '});
    }
};

// Routes
app.post('/account-settings', createAccount);