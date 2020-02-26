require('dotenv').config();
const {Sequelize, Model, DataTypes} = require('sequelize');
const _ = require('underscore');
const Faker = require('faker');
const Conn = new Sequelize(
    process.env.POSTGRES_DB, 
    process.env.POSTGRES_USERNAME, 
    process.env.POSTGRES_PASSWORD,  {
        dialect : 'postgres',
        host: process.env.POSTGRES_HOST
    }
);


const Person = Conn.define('person', {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

const Role = Conn.define('role', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

Person.hasMany(Role);

Conn.sync({force: true}).then(( ) => {
    _.times(10, () => {
        Person.create({
            username: Faker.internet.userName(),
            email: Faker.internet.email(),
            type: Faker.commerce.department()
        })
    });
});