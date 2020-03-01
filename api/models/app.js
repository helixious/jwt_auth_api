module.exports = function(sequelize, DataTypes) { 
    return sequelize.define('app', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            field: 'app_id'
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },  {
        tableName:'app'
    })
};