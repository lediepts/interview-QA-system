import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import database from "../database";
import { User } from "../interfaces";

export interface UserModel
  extends User,
    Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: CreationOptional<number>;
  firstKana: CreationOptional<string>;
  lastKana: CreationOptional<string>;
  tel: CreationOptional<string>;
  status: CreationOptional<"init" | "active" | "deleted">;
}

export const UserSchema = database.define<UserModel>(
  "users",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstKana: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    lastKana: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    tel: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    status: {
      type: DataTypes.ENUM,
      values: ["init", "active", "deleted"],
      allowNull: true,
      defaultValue: "init",
    },
  },
  {
    engine: "InnoDB",
    charset: "utf8mb4",
  }
);
