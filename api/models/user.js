module.exports = function(sequelize, DataTypes) { 
        return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            field: 'user_id'
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName:'user',
        classMethods: {
            associate: (models) => {
                models.User.hasMany(models.Role, {
                    as:'Roles',
                    through: 'user_role',
                    foreignKey:'user_id',
                    otherKey:'role_id'})
            }
        }
    })
};