require('dotenv').config();
const jwt =  require("jsonwebtoken");
const crypto = require('crypto');


const app = require('express')();
const bodyParser = require('body-parser');
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');
const Faker = require('faker');
const typeDefs = require('./schemas/schema');


const _ = require('underscore');


const {buildSchema} = require('graphql');
// const expressGraphql = require('express-graphql');
const port = process.env.PORT;

// database
const db = require('./config/database');
const User = require('./models/user');
const Role = require('./models/role');
const App = require('./models/app');
const UserRole = require('./models/user_role');

User.hasMany(Role, {foreignKey: 'role_id'});
Role.belongsTo(App, {foreignKey: 'app_id'});

UserRole.belongsTo(User, {foreignKey: 'user_id'});
UserRole.belongsTo(Role, {foreignKey: 'role_id', constraints: false});



function createDummyUsers(userCount){
    try {
        _.times(userCount, () => {
            User.create({
                username: Faker.internet.userName(),
                email: Faker.internet.email(),
                type: Faker.commerce.department(),
                state: 'active'
            })
        });
    } catch(e) {
        console.log(e);
    }
};

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

db.authenticate().then(() => console.log('Database connected...'))
.catch(err => {
    console.log('Error: ' + err);
    process.exit(1);
});
const auth = new Authorization;
// let user = {name: 'stephane le', email:'sle@helixious.com'};




// GraphQL Schema
var schema = buildSchema(`
    type Query {
        userById(id: Int!): User

    }

    type User {
        id: Int
        username: String
        role: String
    }
`);

app.use('graphiql', graphiqlExpress({
    endpointURL: '/graphql'
}));

app.user('/graphql', bodyParser.json(), graphqlExpress({}));
app.listen(port, () => console.log(`GraphQL Server running on localhost:${port}/graphql`));


// const server = new ApolloServer({ typeDefs });
// server.listen().then(({ url }) => {
//     console.log(`🚀 Server ready at ${url}`);
// });



// // Root resolver
// var root = {
//     message: () => 'Request OK'
// };

// app.use(bodyParser.json());
// app.use('/graphql', expressGraphql({
//     schema: schema,
//     rootValue: root,
//     graphiql: true // set false for production
// }));


// Create an express server and a GraphQL endpoint

// app.post('/login', (req, res) => {    
//     // username, userId, appId, roleId
//     let user = req.body;
//     console.log(user)

//     // if request already includes access token => validate token

//     auth.createAccessToken(user, (err, aToken) => {
//         if(!err) {
//             auth.createRefreshToken(user, (err, rToken) => {
//                 res.status(500).json(!err ? {access_token:aToken, refresh_token:rToken} : {error:err})
//             });
//         } else {
//             res.status(500).json({error:err})
//         }
//     });
// });

// app.listen(port, () => console.log(`GraphQL Server running on localhost:${port}/graphql`));

// (async () => {
//     await db.sync({force: true}); //{ force: true }
//     createDummyUsers(10);
// })();



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



