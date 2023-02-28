import express from "express";
import { user } from "./user";
export const api = express.Router();

api.use("/user", user);
