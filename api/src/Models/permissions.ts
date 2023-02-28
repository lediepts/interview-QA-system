import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import database from "../database";
import { Permission } from "../interfaces";

export interface PermissionModel
  extends Permission,
    Model<
      InferAttributes<PermissionModel>,
      InferCreationAttributes<PermissionModel>
    > {
  id: CreationOptional<number>;
  desc: CreationOptional<string>;
}

export const PermissionSchema = database.define<PermissionModel>(
  "permissions",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
  },
  {
    timestamps: false,
    engine: "InnoDB",
    charset: "utf8mb4",
  }
);
