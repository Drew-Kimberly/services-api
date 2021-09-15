const { DataTypes, Model } = require('sequelize');
const { db } = require('..');

class Version extends Model {}

Version.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: db.sequelize,
        modelName: 'Version'
    }
);

module.exports = { Version };
