import { sign, verify, VerifyErrors } from "jsonwebtoken";
import { TokenInfo } from "../interfaces";

export const createToken = (tokenInfo: TokenInfo) => {
  try {
    if (!process.env.AUTH_TOKEN_SECRET || !process.env.AUTH_TOKEN_LIFE)
      throw -1;
    return sign(
      {
        ...tokenInfo,
      },
      process.env.AUTH_TOKEN_SECRET,
      {
        algorithm: "HS256",
        expiresIn: process.env.AUTH_TOKEN_LIFE + "d",
      }
    );
  } catch (error) {
    console.log(error);
    throw 500;
  }
};

export const verifyToken = (token: string) => {
  try {
    if (!process.env.AUTH_TOKEN_SECRET) throw -1;
    if (!token)
      throw {
        message: "token is null",
      };
    const info = verify(token, process.env.AUTH_TOKEN_SECRET) as TokenInfo;
    return info;
  } catch (error) {
    console.log((error as VerifyErrors).message);
    throw 500;
  }
};
