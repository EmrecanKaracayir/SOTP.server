import express, { Express } from "express";
import { ConfigConstants } from "./app/constants/ConfigConstants";
import { CatcherMiddleware } from "./app/middlewares/CatcherMiddleware";
import { FailureMiddleware } from "./app/middlewares/FailureMiddleware";
import { LoggerMiddleware } from "./app/middlewares/LoggerMiddleware";
import { MethodMiddleware } from "./app/middlewares/MethodMiddleware";
import { LoginBuilder } from "./core/login/LoginBuilder";
import { PairBuilder } from "./core/pair/PairBuilder";
import { DecryptBuilder } from "./core/decrypt/DecryptBuilder";
import { DeleteBuilder } from "./core/delete/DeleteBuilder";

// App
const app: Express = express();

// Pre-Middlewares
app.use(express.json());
app.use(LoggerMiddleware.log);

// Routes without authentication
app.use(
  `${ConfigConstants.API_PREFIX}/${LoginBuilder.BASE_ROUTE}`,
  new LoginBuilder().router,
);
app.use(
  `${ConfigConstants.API_PREFIX}/${PairBuilder.BASE_ROUTE}`,
  new PairBuilder().router,
);
app.use(
  `${ConfigConstants.API_PREFIX}/${DecryptBuilder.BASE_ROUTE}`,
  new DecryptBuilder().router,
);
app.use(
  `${ConfigConstants.API_PREFIX}/${DeleteBuilder.BASE_ROUTE}`,
  new DeleteBuilder().router,
);

// Post-Middlewares
app.use("*", MethodMiddleware.methodNotAllowed);
app.use("*", CatcherMiddleware.resourceNotFound);
app.use(FailureMiddleware.serverFailure);

// Server
app.listen(ConfigConstants.PORT, (): void => {
  console.log(`Server listening on port ${ConfigConstants.PORT}`);
});
