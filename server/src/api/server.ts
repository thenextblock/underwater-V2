import express, { Application, RequestHandler } from "express";
import coreMiddleware from "./middleware";
import Config from "../config";
import { AuthService } from "./middleware/Gwt";
import {
  User,
  getBlocks,
  getMarketsByBlockNumber,
  getSnapshoDataByBlockNumber,
  getAccountSnapshotDetails,
  getAccountSnapshotRow,
  // runscanner,
} from "./controller/index";

const app: Application = express();
app.use(coreMiddleware);
app.use(express.json() as RequestHandler);
app.use(express.urlencoded({ extended: true }) as RequestHandler);

export class AppServer {
  public async init() {
    console.log("=========== INTIALIZE SERVER =================");

    const { checkGwtToken } = new AuthService();
    const { login } = new User();

    app.get("/api/status", (req, res) => {
      res.status(200).json({ status: "ok", msg: "Bot API Service ... " });
    });

    /* Login : */
    app.post("/api/user", login);

    /* create User : client */
    // app.put("/api/user", create);

    app.get("/api/blocks", getBlocks);
    app.get("/api/blocks/:blockumber", getMarketsByBlockNumber);

    app.get("/api/snapshot/:blockumber", getSnapshoDataByBlockNumber);
    app.get("/api/snapshot/:blockumber/:account", getAccountSnapshotDetails);

    app.get("/api/snapshot/row/:blockumber/:account", getAccountSnapshotRow);

    // app.get("/api/scanner", runscanner);

    app.listen(Config.port, () => {
      console.log(`App is listening on port ${Config.port}`);
    });
  }
}
