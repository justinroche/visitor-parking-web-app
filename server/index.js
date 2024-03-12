const express = require('express');
const cors = require('cors');

// Create an express app instance.
const app = express();

// Enable cross-origin resource sharing for all routes.
app.use(cors());
app.use(express.json());

// The server will listen for incoming HTTP requests on port 8080.
app.listen(8080, () => {
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
