import express from "express";
import { UserSchema } from "../../Models";
export const user = express.Router();
user.get("/", async (req, res) => {
  try {
    const users = await UserSchema.findAll();
    res.send(users);
  } catch (error) {
    res.status(500).end();
  }
});
