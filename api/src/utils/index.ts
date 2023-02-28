import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
export * from "./jwt";
export * from "./cookie";
export * from "./authMiddleware";
export * from "./mailService";

export const getIP = (req: Request<any>) => {
  const getIp = require("ipware")().get_ip;
  const { clientIp }: { clientIp: string; clientIpRoutable: boolean } =
    getIp(req);
  const forwarded = req.headers["x-forwarded-for"] as string;
  return forwarded || clientIp;
};
export const hash = (pass: string) => {
  const hash = bcrypt.hashSync(pass, 10);
  return hash;
};
export const checkHash = (pass: string, hash: string) => {
  const check = bcrypt.compareSync(pass, hash);
  return check;
};

export function validatorsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.sendStatus(400);
  }
  next();
}

export const randomStr = ({
  length,
  number,
  character,
  symbol,
}: {
  length: number;
  number?: boolean;
  character?: boolean;
  symbol?: boolean;
}) => {
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const characters = [
    "A",
    "a",
    "B",
    "b",
    "C",
    "c",
    "D",
    "d",
    "E",
    "e",
    "F",
    "f",
    "G",
    "g",
    "H",
    "h",
    "I",
    "i",
    "J",
    "j",
    "K",
    "k",
    "L",
    "l",
    "M",
    "m",
    "N",
    "n",
    "O",
    "o",
    "P",
    "p",
    "Q",
    "q",
    "R",
    "r",
    "S",
    "s",
    "T",
    "t",
    "U",
    "u",
    "V",
    "v",
    "W",
    "w",
    "X",
    "x",
    "Y",
    "y",
    "Z",
    "z",
    "Z",
  ];
  const symbols = ["!", "%", "(", ")", "-", ".", "_"];
  const rs: string[] = [];
  const str: string[] = [];
  if (number) {
    str.push(...numbers);
  }
  if (character) {
    str.push(...characters);
  }
  if (symbol) {
    str.push(...symbols);
  }
  for (let index = 0; index < length; index++) {
    const arr = str.filter((f) => !!f);
    const tmp = Math.ceil(Math.random() * (arr.length - 2));
    const char = arr[tmp];
    rs.push(char);
  }
  return rs.join("");
};

export * from "./authMiddleware";
export * from "./cookie";
export * from "./jwt";
export * from "./mailService";
