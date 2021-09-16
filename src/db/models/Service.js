const { DataTypes, Model } = require('sequelize');
const { Version } = require('./Version');

class Service extends Model {}

const init = sequelize => Service.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        }
    },
    {
        sequelize: sequelize,
        modelName: 'Service'
    }
);

module.exports = { init, Service };
