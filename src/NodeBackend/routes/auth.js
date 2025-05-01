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

    if(req?.email === undefined || req?.password === undefined){
        res.status(400).send("Invalid Username or password");
    }

    console.log(req.body)
    console.log("hi")
    const email = req.email
    const pass = req.password

    // return jsonify({
    //     'message': 'Login successful',
    //     'user': user.to_json(),
    //     "access_token": access_token
    // }), 200

    res.status(200).send({t: 'login'});

});

// Logout
router.get('/logout', (req, res) => {
    res.send('logout');
});


export default router