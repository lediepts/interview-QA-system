import express from "express";
import { UserSchema } from "../../Models";
export const user = express.Router();
user.get("/", async (req, res) => {
  try {
    const users = await UserSchema.findAll();
    res.send(users);
  } catch (error) {
    console.log(error);
    res.sendStatus(Number(error) || 500);
  }
});
