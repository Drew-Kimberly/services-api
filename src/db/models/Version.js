const { DataTypes, Model } = require('sequelize');

class Version extends Model {}

const init = sequelize => Version.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: sequelize,
        modelName: 'Version'
    }
);

module.exports = { init, Version };
