import { AppServer } from "./server";

(async () => {
  console.log("________START API ________");

  const server = new AppServer();
  await server.init();
  console.log("... THE GLOBAL VARIABLE ... ");
})();
