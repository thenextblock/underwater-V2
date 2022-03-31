import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";
import { StatusCodes } from "http-status-codes";
import logger from "../../utils/logger";

import { GWT_SECRET } from "../../config";

export class User {
  constructor() {
    this.login = this.login.bind(this);
  }

  async login(req: Request, res: Response) {
    logger.info("Login Request %s:", req.body);
    let { username, password } = req.body;
    let response: ApiResponse = {
      success: false,
    };

    if (password !== "123" && username != "achiko") {
      response.message = "Wrong Password or username "; // To Do Change the response
      return res.status(StatusCodes.NOT_FOUND).json(response);
    }

    let token = jwt.sign(
      {
        userid: 1,
        username: "achiko",
        role: "admin",
      },
      GWT_SECRET,
      { expiresIn: "72h" }
    ); // To Do : Move to Config expeireTime

    logger.debug("GWT Token %s ", token);

    response.success = true;
    response.token = token;
    response.data = []; // attach User Data to response

    return res.status(StatusCodes.OK).json(response);
  }
}
