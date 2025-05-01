// Create a simple Express server
import express from 'express';
import bodyParser from 'body-parser';

import cors from 'cors'
const server = express();

// var corsOptions = {
//     origin: 'http://example.com',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

server.use(cors())
server.use(bodyParser.json())

const baseRoute = "/api/v1"

server.get(baseRoute, (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

import userRouter from './routes/example.js';
import testRouter from './routes/test.js';
import authRouter from './routes/auth.js';



server.use(baseRoute, userRouter)
server.use(baseRoute, testRouter)
server.use(baseRoute, authRouter)



// Example specifying the port and starting the server
const port = process.env.PORT || 3001; // You can use environment variables for port configuration
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

