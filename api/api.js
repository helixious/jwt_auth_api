require('dotenv').config();
const jwt =  require("jsonwebtoken");
const crypto = require('crypto');
const app = require('express')();
const bodyParser = require('body-parser');
const _ = require('underscore');

function keygen() {
    return crypto.randomBytes(64).toString('hex');
}

class Authorization {
    constructor() {
        this.accessSecret = process.env.JWT_ACCESS_SECRET;
        this.refreshSecret = process.env.JWT_REFRESH_SECRET;

        if(!this.accessSecret || !this.refreshSecret) {
            console.log('missing keys');
            process.exit(1);
        }
    }

    async createRefreshToken(data, res) {
        try {
            let token = await jwt.sign(data, process.env.JWT_REFRESH_SECRET || 'secret');
            return res ? res(null, token) : token;
        } catch(e) {
            let msg = 'Error signing data';
            return res ? res(msg, null) : msg;
        };
    }
    
    async createAccessToken(data, res) {
        try {
            let token = await jwt.sign(data, process.env.JWT_ACCESS_SECRET || 'secret', {expiresIn: '4h'});
            return res ? res(null, token) : token;
        } catch(e) {
            let msg = 'Error signing data';
            return res ? res(msg, null) : msg;
        };
    }

    async verifyRefreshToken(token, res) {
        try {
            let decodedData = await jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'secret');
            return res ? res(null, decodedData) : decodedData;
        } catch(e) {
            let msg = 'Error verifying token';
            return res ? res(msg, null) : msg;
        };
    }

    async verifyAccessToken(token, res) {
        try {
            let decodedData = await jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'secret');
            return res ? res(null, decodedData) : decodedData;
        } catch(e) {
            let msg = 'Error verifying token';
            return res ? res(msg, null) : msg;
        };
    }
}


const auth = new Authorization;
// let user = {name: 'stephane le', email:'sle@helixious.com'};

app.use(bodyParser.json());

app.post('/login', (req, res) => {    
    // username, userId, appId, roleId
    let user = req.body;
    console.log(user)

    // if request already includes access token => validate token

    auth.createAccessToken(user, (err, aToken) => {
        if(!err) {
            auth.createRefreshToken(user, (err, rToken) => {
                res.status(500).json(!err ? {access_token:aToken, refresh_token:rToken} : {error:err})
            });
        } else {
            res.status(500).json({error:err})
        }
    });
});

app.listen(3000);



// auth.createAccessToken(user).then(aToken => {
//     auth.createRefreshToken(user).then(rToken => {
//         console.log(`access token: ${aToken}`);
//         console.log(`refresh Token: ${rToken}`);
//     }).catch(err => {
//         console.log(err);
//     });
// });
// auth.createToken(user, (err, token) => {
//     if(!err) {
//         console.log(token);
//     } else {

//     }
// });


// auth.createToken(user).then(token => {
//     auth.verifyToken(token).then(data => {
//         console.log(data);
//     });
// }).catch(err => {
//     console.log(err);
// });



