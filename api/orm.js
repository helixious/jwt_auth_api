const Faker = require('faker');
const _ = require('underscore');


const {sequelize, DataTypes} = require('./config/database');

const Model = {
    User: require('./models/user')(sequelize, DataTypes),
    Role: require('./models/role')(sequelize, DataTypes),
    App: require('./models/app')(sequelize, DataTypes),
    UserRole: require('./models/user_role')(sequelize, DataTypes)
};
const typeDefs = require('./schemas/schema');

class ORM {
    constructor (){
        // setup database
        this.sequelize = sequelize;
        this.DataTypes = DataTypes;
        this.typeDefs = typeDefs;
        this.resolvers = {
            Query: this.query(),
            Mutation: this.mutation()
        }

        this.associate();
        
        sequelize.authenticate().then(() => {
            console.log('Database connected...')
        }).catch(err => {
            console.log('Error: ' + err);
            process.exit(1);
        });
    }

    query() {
        return {
            async users(root) {
                return await User.findAll();
            },
            async getUser (root, {user_id}) {
                return await Model.User.findByPk(user_id, {
                    include: Model.Role});
            },
            async getApp(root, {app_id}) {
                return await Model.App.findByPk(app_id)
            },
            async getRole(root, {role_id, app_id}) {
                if(role_id && app_id) {
                    return await Model.Role.findAll({ where: {role_id: role_id, app_id: app_id}});
                } else if(app_id) {
                    return await Model.Role.findAll({ where: {app_id: app_id}});
                }
                return await Model.Role.findByPk(role_id);
            },
            async getUserRole(root, {user_id}) {
                return await Model.UserRole.findAll({ where: {user_id: user_id}});
            }
        }
    }

    mutation() {
        return {
            async createUser(root, {input}) {
                input.state = 'active';
                input.type = 'user';
                return await Model.User.create(input);
            },
            async updateUser(root, {user_id, input}) {
                var user = await Model.User.findByPk(user_id);
                if(user) await user.update(input);
        
                return user;
            },
            async createUserRole(root, {input}) {
                var userRole = await Model.UserRole.findOrCreate({
                    where: {user_id:input.user_id, role_id:input.role_id},
                    defaults: {
                        state: 'active'
                    }
                });
    
                return userRole[0] || userRole[1];
            },
            async createRole(root, {input}) {
                var role = await Model.Role.findOrCreate({
                    where: {app_id:input.app_id, name:input.name},
                    defaults: {
                        state: 'active',
                        description: input.description
                    }
                });
            
                return role[0] || role[1];
            },
            async createApp(root, {input}) {
                return await Model.App.create(input);
            }
        }
    }

    associate() {
        Model.Role.belongsToMany(Model.User, {through: 'user_role', foreignKey:'role_id'});
        Model.User.belongsToMany(Model.Role, {through: 'user_role', foreignKey:'user_id'});
    }

    createDummyApps() {
        Model.App.create({
            name: 'Droplet',
            description: 'Opensource Filesharing platform'
        });
        Model.App.create({
            name: 'Foodie Nation',
            description: 'Social network for people who love to eat'
        })
    }

    createDummyUsers(userCount){
        try {
            _.times(userCount, () => {
                Model.User.create({
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

    async ready(resolve) {
        // await sequelize.sync({force: true});
        await sequelize.sync();
        console.log('DONE')
        resolve();
    }
};

module.exports = new ORM;