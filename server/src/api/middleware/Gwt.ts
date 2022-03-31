import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import Config from "../../config";
import { RequestExtended, ApiResponse } from "../types";
import logger from "../../utils/logger";

function extractHeaderToken(req: RequestExtended): string {
  let token = req.headers["authorization"];
  if (token === undefined) {
    return "";
  }
  return token;
}

export class AuthService {
  constructor() {
    this.checkGwtToken = this.checkGwtToken.bind(this);
  }

  checkGwtToken(req: any, res: Response, next: NextFunction) {
    let responseBody: ApiResponse;
    let token = extractHeaderToken(req);

    if (!token) {
      console.group("Token %s is not valid", token);
      responseBody = { success: false, message: "invalid Token", data: [] };
      return res.status(StatusCodes.FORBIDDEN).json(responseBody);
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    if (token) {
      jwt.verify(token, Config.GWT_SECRET, (err: any, decoded: any) => {
        if (err) {
          logger.debug("Config.GWT_SECRET %s", Config.GWT_SECRET);
          logger.error("GWT Error %s ", err?.message);
          logger.error("GWT Error %s ", err?.name);
          responseBody = {
            success: false,
            message: "Token Error",
            error: "Invalid JWT Signature",
          };
          return res.status(StatusCodes.FORBIDDEN).json(responseBody);
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      responseBody = {
        success: false,
        message: "Token Error",
        error: "Auth token is not supplied",
      };
      return res.status(StatusCodes.FORBIDDEN).json(responseBody);
    }
  }
}
