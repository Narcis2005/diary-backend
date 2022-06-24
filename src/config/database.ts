import { Sequelize } from "sequelize";

const database = new Sequelize("diary", "postgres", "FqBchjo>iU5", {
    host: "localhost",
    dialect: "postgres",
    logging: false,
});

export default database;
