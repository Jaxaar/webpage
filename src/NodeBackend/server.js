// Create a simple Express server
const express = require('express');
const server = express();

const baseRoute = "/api/v1"

server.get(baseRoute, (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

const usersRoute = require('./routes/example');

server.use(baseRoute, usersRoute)

// Example specifying the port and starting the server
const port = process.env.PORT || 3001; // You can use environment variables for port configuration
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

