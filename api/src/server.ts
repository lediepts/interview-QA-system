import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { createServer } from "http";
import morgan from "morgan";
import { ServiceRequest } from "./interfaces";
import { api, auth } from "./Routers";
import { getIP } from "./utils";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cookieParser("DHrfHY17STOMAIpNLC1ycOUpOKA3NoDak9Tjo"));
app.use(
  express.json({
    limit: "10mb",
  })
);

export const server = createServer(app);

// =======LOGGER=======
morgan.token("IP", function (req: Request) {
  return getIP(req);
});
morgan.token("TIME", function (req: Request) {
  return new Date().toLocaleTimeString();
});

morgan.token("req-data", function (req: ServiceRequest, res) {
  return `${
    req.params && Object.keys(req.params).length > 0
      ? "\nparams:" + JSON.stringify(req.params, null, 2)
      : ""
  }${req.query && Object.keys(req.query).length > 0 ? "\nquery:" + JSON.stringify(req.query, null, 2) : ""}${req.body && Object.keys(req.body).length > 0 ? "\nbody:" + JSON.stringify(req.body, null, 2) : ""}`;
});

app.use(
  morgan("=>[:TIME] :IP :method :url :status [:response-time ms] :req-data", {
    skip: function (req, res) {
      return (
        /\/storage\//.test(req.originalUrl) ||
        /\.[ico|json|png|svg|jpg|css|ttf|js|map]/g.test(req.originalUrl)
      );
    },
  })
);

// APP cache setting

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-XSS-Protection", "1; mode=block");
  if (req.path.match(/\/api\//)) {
    res.setHeader("Cache-control", "no-cache, no-store");
    res.setHeader("Pragma", "no-cache");
  }
  next();
});

// API Router setting

app.use("/api", api);
app.use("/auth", auth);

app.use("/*", (req, res) => {
  res.sendStatus(404);
});

function start(port: number) {
  server.listen(port, () => {
    console.log("\x1b[32m%s\x1b[0m", `サーバの起動が完了しました。`);
    console.log(
      "\x1b[32m%s\x1b[1m\x1b[4m%s\x1b[0m",
      "URL: ",
      `http://localhost:${port}/`
    );
  });
}

export default {
  start,
};
