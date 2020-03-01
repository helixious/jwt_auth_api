
require('dotenv').config();
const {Sequelize, DataTypes} = require('sequelize');
module.exports = {
    sequelize: new Sequelize(
        process.env.POSTGRES_DB, 
        process.env.POSTGRES_USERNAME, 
        process.env.POSTGRES_PASSWORD,  {
            dialect : 'postgres',
            host: process.env.POSTGRES_HOST
        }
    ),
    DataTypes: DataTypes
}