import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import { IBuilder } from "../../app/interfaces/IBuilder";
import { LogetController } from "./LogetController";

export class LogetBuilder implements IBuilder {
  public static readonly BASE_ROUTE: string = "loget";

  public readonly router: Router;

  private readonly mController: LogetController;

  constructor() {
    this.router = Router();
    this.mController = new LogetController();
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: LogetBuilder.BASE_ROUTE, route: "/" },
      Method.POST,
      this.mController.postLogin.bind(this.mController),
    );
  }
}
