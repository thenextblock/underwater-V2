import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { Pool } from "pg";

let db = {
  host: process.env.PGHOST || "",
  user: process.env.PGUSER || "",
  database: process.env.PGDATABASE || "",
  password: process.env.PGPASSWORD || "",
  port: Number(process.env.PGPORT) || 5433,
  max: Number(process.env.PG_MAX_CLIENT) || 499,
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS) || 30000,
};

console.log(db);

const pool = new Pool(db);

// callback - checkout a client
pool.connect((err, client, done) => {
  if (err) throw err;
  client.query("SELECT NOW();", [], (err, res) => {
    done();
    if (err) {
      console.log(err.stack);
    } else {
      console.log(res.rows[0]);
    }
  });
});

// (async () => {
//   const client = await pool.connect();

//   try {
//     const res = await client.query("select now();", []);
//     console.log(res.rows[0]);
//   } finally {
//     // Make sure to release the client before any error handling,
//     // just in case the error handling itself throws an error.
//     client.release();
//   }
// })().catch(err => console.log(err.stack));

// import { getAssetsIn } from "./scanner/accountSnapshot";
// (async () => {
//   let assets = await getAssetsIn("0x4990e88463265d87e7c9b138eeb93c8535e11253");
//   console.log(assets);
// })();

// interface iTest {
//   age: number;
//   sex: boolean;
// }

// let nameAgeMapping = new Map<string, iTest>();
// nameAgeMapping.set("achiko", { age: 22, sex: true });
// nameAgeMapping.set("petre", { age: 23, sex: false });

// console.log(nameAgeMapping);
// console.log("----");
// console.log(nameAgeMapping.size);

// let test = nameAgeMapping.get("achiko");
// console.log(test);

// for (let key of nameAgeMapping.keys()) {
//   console.log(key, nameAgeMapping.get(key));
//   console.log("----");
// }
