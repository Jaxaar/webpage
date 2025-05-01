import { Router } from 'express';
import jwt from "jsonwebtoken"

const router = Router();




// refresh JWT
function refreshJWT(){
    jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60)},"reallySecretKey")

}


// Register
router.get('/register', (req, res) => {
    res.send('register');
});

// Login
router.post('/login', (req, res) => {

    console.log(req.body)

    const username = req?.body?.username
    const password = req?.body?.password

    if(username === undefined || password === undefined){
        res.status(400).send("Username and password required");
    }

    // Check if user exists in db
    if(!true){
        res.status(404).send("User doesn't exist");
    }

    // Check if password is not right for the user
    if(password !== "test"){
        res.status(401).send("Incorrect Username or password");
        console.log("hi")
    }

    const accessToken = ""

    
    const reply = {
        'message': 'Login successful',
        'user': username,
        "access_token": accessToken
    }

    res.status(200).send(reply);

});

// Logout
router.get('/logout', (req, res) => {
    res.send('logout');
});


export default router