const { DataTypes, Model } = require('sequelize');

class Version extends Model {}

const init = sequelize =>
    Version.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize: sequelize,
            name: { singular: 'version', plural: 'versions' }
        }
    );

module.exports = { init, Version };
