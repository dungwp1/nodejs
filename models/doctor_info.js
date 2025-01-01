'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doctor_Info extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Doctor_Info.belongsTo(models.User, { foreignKey: 'doctorId' })
            Doctor_Info.belongsTo(models.Allcode, { foreignKey: 'priceId', as: 'priceData', targetKey: 'keyMap' })
            Doctor_Info.belongsTo(models.Allcode, { foreignKey: 'provinceId', as: 'provinceData', targetKey: 'keyMap' })
            Doctor_Info.belongsTo(models.Allcode, { foreignKey: 'paymentId', as: 'paymentData', targetKey: 'keyMap' })

        }
    }
    Doctor_Info.init({
        doctorId: DataTypes.INTEGER,
        priceId: DataTypes.STRING,
        provinceId: DataTypes.STRING,
        paymentId: DataTypes.STRING,
        addressClinic: DataTypes.STRING,
        nameClinic: DataTypes.STRING,
        note: DataTypes.TEXT,
        count: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Doctor_Info',
    });
    return Doctor_Info;
};