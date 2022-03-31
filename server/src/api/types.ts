import { Request, Response, NextFunction } from "express";

export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
  token?: string;
}

export interface RequestExtended extends Request {
  decoded: object | undefined;
}

export interface GwtDecoded {
  userid: number;
  username: string;
  role: string;
}
