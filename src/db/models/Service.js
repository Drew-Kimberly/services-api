const { DataTypes, Model } = require('sequelize');
const { db } = require('../');

class Service extends Model {}

Service.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        versions: {
            type: DataTypes.ARRAY,
            allowNull: false,
            defaultValue: []
        }
    },
    {
        sequelize: db.sequelize,
        modelName: 'Service'
    }
);

module.exports = { Service };
