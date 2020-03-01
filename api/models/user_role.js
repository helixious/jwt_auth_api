module.exports = function(sequelize, DataTypes) {
    return sequelize.define('user_role', {
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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true,
            field: 'user_id'
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName:'user_role'
    })
};