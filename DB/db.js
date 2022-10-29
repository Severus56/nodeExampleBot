const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    {
        database: "d5ksck4bain4fd",
        username: "tttnldaaseavkr",
        password: "3b9db438aa73143e60732963d005dadb75b1a58cf87e3441b55d5fe8e21d7af2",
        host: "ec2-99-81-68-240.eu-west-1.compute.amazonaws.com",
        port: 5432,
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
    });
