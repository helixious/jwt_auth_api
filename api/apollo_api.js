require('dotenv').config();

const port = process.env.PORT;
const app = require('express')();
const {ApolloServer, gql} = require('apollo-server-express');
const Faker = require('faker');
// const typeDefs = require('./schemas/schema');
const _ = require('underscore');


const db = require('./config/database');
const User = require('./models/user');
const Role = require('./models/role');
const App = require('./models/app');
const UserRole = require('./models/user_role');

// User.hasMany(Role, {foreignKey: 'role_id'});
// Role.belongsTo(App, {primaryKey: 'app_id'});
Role.belongsToMany(User, {as:'Users', through: 'user_role', foreignKey:'role_id', otherKey:'user_id'})
User.belongsToMany(Role, {as:'Roles', through: 'user_role', foreignKey:'user_id', otherKey:'role_id'})
Role.belongsTo(App, {foreignKey: 'app_id'});
UserRole.belongsTo(Role, {foreignKey: 'role_id'});
UserRole.belongsTo(User, {foreignKey: 'user_id'});

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
function createDummyApps() {
    App.create({
        name: 'Droplet',
        description: 'Opensource Filesharing platform'
    });
    App.create({
        name: 'Foodie Nation',
        description: 'Social network for people who love to eat'
    })
}

function createDummyRoles() {
    Role.create({
        name: 'admin',
        description: 'full access user'  
    })
}





db.authenticate().then(() => console.log('Database connected...'))
.catch(err => {
    console.log('Error: ' + err);
    process.exit(1);
});

// (async () => {
//     await db.sync({force: true}); //{ force: true }
//     createDummyUsers(10);
// })();

// return;

function response() {
    return 'hello world!';
}

const typeDefs = gql`

    input UserInput {
        username: String
        email: String
        state: String
        type: String
    }

    input RoleInput {
        app_id: Int!
        name: String!
        description: String!
        state: String
    }

    input UserRoleInput {
        role_id: Int!
        user_id: Int!
        state: String
    }

    input AppInput {
        name: String!
        description: String!
    }

    type UserRole {
        role_id: Int
        user_id: Int
        state: String
    }


    type Role {
        id: Int
        app_id: Int
        name: String
        description: String
        state: String
    }

    type User {
        id: Int
        user_id: Int
        username: String
        email: String
        state: String
        type: String
        roles:[Role]
    }

    type App {
        id: Int
        app_id: Int
        name: String
        description: String
    }

    type Query {
        getUser(user_id: ID!): User
        getUserRole(user_id:ID!): [UserRole]
        getApp(app_id: ID): App
        getRole(app_id: ID, role_id: ID): [Role]
        users:[User]
        roles:[Role]
        apps:[App]
    }

    type Mutation {
        createUser(input: UserInput): User
        createApp(input: AppInput): App
        createRole(input: RoleInput): Role
        createUserRole(input: UserRoleInput): UserRole
        updateUser(user_id: ID!, input: UserInput): User
        updateApp(app_id: ID!): App
        updateRole(role_id: ID!): Role
        
    }
    
    schema {
        query: Query
        mutation: Mutation
    }
`;

const resolvers = {
    Query: {
        async users(root) {
            return await User.findAll();
        },
        async getUser (root, {user_id}) {
            // var user = await User.findByPk(user_id);
            // if(user) {
            //     UserRole.findAll({ where: {user_id:}})
            // }
            var user = await User.findByPk(user_id);
            if(user) {
                var roles = await UserRole.findAll({
                    where: {user_id:user_id}
                });

                // roles.forEach(role => {
                //     console.log(role)
                // })

                var roleIds = _.map(roles, (role) => {
                    return role.role_id
                });



                user.roles = await Role.findAll({
                    where: {role_id: roleIds}
                });
            }

            // console.log(user);

            return user;

        },
        async getApp(root, {app_id}) {
            return await App.findByPk(app_id)
        },
        async getRole(root, {role_id, app_id}) {
            if(role_id && app_id) {
                return await Role.findAll({ where: {role_id: role_id, app_id}});
            } else if(role_id) {
                return await Role.findAll({ where: {role_id: role_id}});
            } else if(app_id) {
                return await Role.findAll({ where: {app_id: app_id}});
            } 
            // return await Role.findByPk(id);
            return null;
        },
        async getUserRole(root, {user_id}) {
            return await UserRole.findAll({ where: {user_id: user_id}});
        }
    },
    Mutation: {
        async createUser(root, {input}) {
            input.state = 'active';
            input.type = 'user';
            return await User.create(input);
        },
        async updateUser(root, {user_id, input}) {
            var user = await User.findByPk(user_id);
            if(user) await user.update(input);
    
            return user;
        },
        async createUserRole(root, {input}) {
            var userRole = await UserRole.findOrCreate({
                where: {user_id:input.user_id, role_id:input.role_id},
                defaults: {
                    state: 'active'
                }
            });

            return userRole[1] || userRole[0];
        },
        async createRole(root, {input}) {
            var role = await Role.findOrCreate({
                where: {app_id:input.app_id, name:input.name},
                defaults: {
                    state: 'active',
                    description: input.description
                }
            });
        
            return role[1] || role[0];
        },
        async createApp(root, {input}) {
            return await App.create(input);
        }
    }
}


// app.use('/graphiql', expressGraphql({}));
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });
(async () => {
    // await db.sync({ force: true }); //{ force: true }
    await db.sync();
    // createDummyApps();
    // createDummyUsers(10);
    app.listen({port: port}, () => {
        console.log(`🚀 Server ready at localhost:${port}/graphql`);
    });
})();






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



