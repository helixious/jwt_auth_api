const {Sequelize, DataTypes} = require('sequelize');
const db = require('../config/database');

module.exports = db.define('user_role', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'user_role_id'
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        field: 'role_id'
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

