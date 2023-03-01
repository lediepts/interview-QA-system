import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import database from "../database";
import { LoginHistory } from "../interfaces";

export interface LoginHistoryModel
  extends LoginHistory,
    Model<
      InferAttributes<LoginHistoryModel>,
      InferCreationAttributes<LoginHistoryModel>
    > {
  id: CreationOptional<number>;
}

export const LoginHistorySchema = database.define<LoginHistoryModel>(
  "loginHistories",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    authId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
    },
    ip: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    engine: "InnoDB",
    charset: "utf8mb4",
  }
);
