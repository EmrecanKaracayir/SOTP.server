import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import { IBuilder } from "../../app/interfaces/IBuilder";
import { DecryptController } from "./DecryptController";

export class DecryptBuilder implements IBuilder {
  public static readonly BASE_ROUTE: string = "decrypt";

  public readonly router: Router;

  private readonly mController: DecryptController;

  constructor() {
    this.router = Router();
    this.mController = new DecryptController();
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: DecryptBuilder.BASE_ROUTE, route: "/" },
      Method.POST,
      this.mController.postDecrypt.bind(this.mController),
    );
  }
}
