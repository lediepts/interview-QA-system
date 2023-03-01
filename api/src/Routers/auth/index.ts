import express, { Response } from "express";
import { body } from "express-validator";
import { Op } from "sequelize";
import database from "../../database";
import { ServiceRequest, TokenInfo } from "../../interfaces";
import { AuthSchema, LoginHistorySchema, UserSchema } from "../../Models";
import { setAuthCookie, validatorsMiddleware } from "../../utils";
import MailService from "../../utils/mailService";

export const auth = express.Router();

auth.post(
  "/register",
  body("userName").isString().isEmail(),
  body("password").isString(),
  body("firstName").isString(),
  body("lastName").isString(),
  validatorsMiddleware,
  async (
    {
      body: {
        userName,
        password,
        firstName,
        lastName,
        firstKana,
        lastKana,
        tel,
      },
    }: ServiceRequest<
      unknown,
      unknown,
      {
        userName: string;
        password: string;
        firstName: string;
        lastName: string;
        firstKana?: string;
        lastKana?: string;
        tel?: string;
      }
    >,
    res: Response
  ) => {
    const t = await database.transaction();
    try {
      const { id: userId } = await UserSchema.create({
        firstName,
        lastName,
        firstKana,
        lastKana,
        tel,
        status: "active",
      });
      await AuthSchema.create({
        userId,
        userName,
        password,
      });
      await t.commit();
      res.sendStatus(201);
    } catch (error) {
      await t.rollback();
      console.log(error);
      res.sendStatus(Number(error) || 500);
    }
  }
);
auth.post(
  "/login",
  body("userName").isString().isEmail(),
  body("password").isString().isLength({ min: 5, max: 72 }),
  validatorsMiddleware,
  async (
    {
      body: { userName, password },
    }: ServiceRequest<
      unknown,
      unknown,
      {
        userName: string;
        password: string;
      }
    >,
    res: Response
  ) => {
    const t = await database.transaction();
    try {
      const auth = await AuthSchema.findOne({
        where: {
          userName,
          password,
        },
        include: [
          {
            model: UserSchema,
            where: {
              status: "active",
            },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: LoginHistorySchema,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (!auth) throw 404;
      if (new Date().getTime() < auth.lockStill) {
        throw 423;
      }
      const mailService = new MailService();
      const passcode = await mailService.sendPassCode(auth.userName);
      await auth.update({
        passcode,
      });
      await t.commit();
      res.sendStatus(200);
    } catch (error) {
      await t.rollback();
      console.log(error);
      res.sendStatus(Number(error) || 500);
    }
  }
);
auth.post(
  "/login/passcode",
  body("userName").isString().isEmail(),
  body("passcode").isString().isLength({ min: 6, max: 6 }),
  validatorsMiddleware,
  async (
    {
      headers,
      body: { userName, passcode },
    }: ServiceRequest<
      unknown,
      unknown,
      {
        userName: string;
        passcode: string;
      }
    >,
    res: Response
  ) => {
    const t = await database.transaction();
    try {
      const blockTime = 1000 * 60 * Number(process.env.BLOCK_TIME || 5);
      const auth = await AuthSchema.findOne({
        where: {
          userName,
          passcode: {
            [Op.ne]: "",
          },
          updatedAt: {
            [Op.gte]: new Date(new Date().getTime() - blockTime),
          },
        },
        include: [
          {
            model: UserSchema,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (!auth) throw 404;

      if (auth.lockStill > new Date().getTime()) throw 423;

      const forwarded =
        (headers["x-forwarded-for"] as string) || "unknown host";
      if (auth.passcode !== passcode) {
        await LoginHistorySchema.create({
          authId: auth.id,
          ip: forwarded,
          success: false,
          type: "default",
        });
        const limit = Number(process.env.LOGIN_LIMIT || 3);
        const last3Login = await LoginHistorySchema.findAll({
          where: {
            authId: auth.id,
          },
          order: [["id", "desc"]],
          limit: limit,
        });
        const successIndex = last3Login.findIndex((f) => f.success);
        if (last3Login.length === limit && successIndex < 0) {
          await auth.update({
            lockStill: new Date().getTime() + blockTime,
          });
        }
        res.status(400).send({
          remain: successIndex < 0 ? 0 : limit - successIndex,
        });
      } else {
        await LoginHistorySchema.destroy({
          where: {
            authId: auth.id,
            createdAt: {
              [Op.lte]: new Date(
                new Date().getTime() - 1000 * 60 * 10 * 24 * 14
              ),
            },
          },
        });
        await LoginHistorySchema.create({
          authId: auth.id,
          ip: forwarded,
          success: true,
          type: "default",
        });
        const userInfo = (auth as any)[`user`];
        const tokenInfo: TokenInfo = {
          info: userInfo,
          permissions: [],
        };
        setAuthCookie(tokenInfo, res);
        await auth.update({
          passcode: "",
        });
        await t.commit();
        res.send(tokenInfo);
      }
    } catch (error) {
      await t.rollback();
      console.log(error);
      res.sendStatus(Number(error) || 500).end();
    }
  }
);
