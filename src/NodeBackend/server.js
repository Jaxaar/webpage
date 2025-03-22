// Create a simple Express server
import express from 'express';
const server = express();

const baseRoute = "/api/v1"

server.get(baseRoute, (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

import userRouter    from './routes/example.js';
import testRouter from './routes/test.js';


server.use(baseRoute, userRouter)
server.use(baseRoute, testRouter)


// Example specifying the port and starting the server
const port = process.env.PORT || 3001; // You can use environment variables for port configuration
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

