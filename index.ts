import Koa from "koa";
import Router from "@koa/router";
import { bodyParser } from "@koa/bodyparser";

import projectRoutes from "./routes/project";
import taskRoutes from "./routes/task";
import commentRoutes from "./routes/comment";
import usersRoutes from "./routes/users";

import authRoutes from "./routes/auth";

// import { query } from "./db.js";

const app = new Koa();
const router = new Router();

router.get("/", (ctx) => {
  ctx.status = 210;
  ctx.body = "Hello World!";
});

/* router.get("/db", async (ctx) => {
  const result = await query("SELECT NOW()");
  ctx.body = result.rows;
}); */

app.use(bodyParser());
app.use(usersRoutes.routes()).use(router.allowedMethods());
app.use(authRoutes.routes()).use(router.allowedMethods());
app.use(projectRoutes.routes()).use(projectRoutes.allowedMethods());
app.use(taskRoutes.routes()).use(taskRoutes.allowedMethods());
app.use(commentRoutes.routes()).use(commentRoutes.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 3000);
