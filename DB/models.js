const sequelize = require('./db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    chatId: {type: DataTypes.INTEGER, unique: true},
    right: {type: DataTypes.INTEGER, defaultValue: 0},
    notRight: {type: DataTypes.INTEGER, defaultValue: 0},
    gamesCount: {type: DataTypes.INTEGER, defaultValue: 0},
    balance: {type: DataTypes.INTEGER, defaultValue: 100},
})

User.sync({ force: false });
module.exports = User;
