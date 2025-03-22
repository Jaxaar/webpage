// routes/users.js
import { Router } from 'express';
const router = Router();
// import  exampleHandler  from '../controllers/examplecontroller.js';

// Define a route
router.get('/xyz', (req, res) => {
    res.send('this is example route2');// this gets executed when user visit http://localhost:3000/example
});

// router.get("/xcontroller", exampleHandler)

export default router