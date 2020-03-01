const {Sequelize, DataTypes} = require('sequelize');
const db = require('../config/database');

module.exports = db.define('token', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'token_id'
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    }
});