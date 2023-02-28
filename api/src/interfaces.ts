import { Request } from "express";
import * as core from "express-serve-static-core";

export interface TokenInfo {
  info: Info;
  permissions: string[];
}

export interface ServiceRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  loginInfo?: TokenInfo;
}

export interface Permission {
  id: number;
  alias: string;
  name: string;
  desc: string;
}

export interface PermissionAssign {
  id: number;
  perId: number;
  userId: number;
}
export interface Info {}
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  firstKana: string;
  lastKana: string;
  email: string;
  tel: string;
  status: "init" | "active" | "deleted";
}

export interface Auth {
  id: number;
  userId: number;
  userName: string;
  password: string;
  passcode: string;
  lockStill: number;
  updatedAt?: string;
}

export interface PWHistory {
  id: number;
  authId: number;
  password: string;
}

export interface LoginHistory {
  id: number;
  authId: number;
  type: string;
  ip: string;
  success: boolean;
  createdAt?: string;
  updatedAt?: string;
}
