import express, { Router } from "express";
import * as cors from "cors";

const router: Router = Router();
router.use(cors.default({ origin: true, credentials: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  } else {
    next();
  }
});

export default router;
