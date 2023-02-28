import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import database from "../database";
import { Auth } from "../interfaces";
import { UserSchema } from "./user";

export interface AuthModel
  extends Auth,
    Model<InferAttributes<AuthModel>, InferCreationAttributes<AuthModel>> {
  id: CreationOptional<number>;
  passcode: CreationOptional<string>;
  lockStill: CreationOptional<number>;
}

export const AuthSchema = database.define<AuthModel>(
  "auths",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passcode: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    lockStill: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    engine: "InnoDB",
    charset: "utf8mb4",
  }
);

AuthSchema.belongsTo(UserSchema, {
  foreignKey: "userId",
});
