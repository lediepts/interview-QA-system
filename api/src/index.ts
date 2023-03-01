import * as dotenv from "dotenv";
dotenv.config();
import database from "./database";
import server from "./server";

const PORT: number = parseInt(process.env.PORT as string, 10);

/**
 *  DB起動
 */
(async () => {
  try {
    console.group("\x1b[35m%s\x1b[0m", "[データベース]");
    console.log(`データベースを接続している。。。`);
    await database.sync({
      alter: process.env.TS_NODE_DEV === "true",
      // force: process.env.TS_NODE_DEV === "true",
    });
    console.log("\x1b[35m%s\x1b[0m", `データベースの接続が完了しました。`);
    console.log(`----------`);
    console.groupEnd();

    // server start
    console.group("\x1b[33m%s\x1b[0m", "[APIサーバ]");
    console.log("\x1b[33m%s\x1b[0m", `APIサーバを起動している...`);
    console.groupEnd();
    server.start(PORT || 8886);
  } catch (error) {
    console.group("\x1b[41m%s\x1b[0m", `[ERROR]`);
    console.error(error.message);
    console.log(`----------`);
    console.groupEnd();
  }
})();
