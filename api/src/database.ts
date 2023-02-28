import { Sequelize } from "sequelize";

const database = new Sequelize(
  `${process.env.DB_NAME}`,
  `${process.env.DB_USER_NAME}`,
  `${process.env.DB_PASSWORD}`,
  {
    host: `${process.env.DB_HOST}`,
    dialect: "mariadb",
    logging: false,
    dialectOptions: {
      connectTimeout: 60000,
    },
    timezone: "+09:00",
  }
);

export default database;
