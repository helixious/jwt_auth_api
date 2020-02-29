const {Sequelize, DataTypes} = require('sequelize');
const db = require('../config/database');

module.exports = db.define('role', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        field: 'role_id'
    },
    app_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        field: 'app_id'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

