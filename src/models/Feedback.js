const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('feedback', {
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        staff: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        staffId: {
            type: DataTypes.INTEGER,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        score:{
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
    },
    {
        paranoid: true,
    }
    )
}