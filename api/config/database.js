
require('dotenv').config();
const {Sequelize, Model, DataTypes} = require('sequelize');
module.exports = new Sequelize(
    process.env.POSTGRES_DB, 
    process.env.POSTGRES_USERNAME, 
    process.env.POSTGRES_PASSWORD,  {
        dialect : 'postgres',
        host: process.env.POSTGRES_HOST
    }
);