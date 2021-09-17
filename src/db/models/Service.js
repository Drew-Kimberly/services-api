const { DataTypes, Model } = require('sequelize');
const { Version } = require('./Version');

class Service extends Model {}

const init = sequelize =>
    Service.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: { args: [1, 128], msg: 'name field must be between 1 and 128 chars' }
                }
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: '',
                validate: {
                    len: { args: [0, 512], msg: 'description field must be between 0 and 512 chars' }
                }
            }
        },
        {
            sequelize: sequelize,
            name: { singular: 'service', plural: 'services' }
        }
    );

module.exports = { init, Service };
