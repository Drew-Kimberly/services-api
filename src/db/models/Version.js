const { DataTypes, Model } = require('sequelize');

class Version extends Model {}

const init = sequelize =>
    Version.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: { args: [1, 128], msg: 'name field must be between 1 and 128 chars' }
                }
            }
        },
        {
            sequelize: sequelize,
            name: { singular: 'version', plural: 'versions' }
        }
    );

module.exports = { init, Version };
