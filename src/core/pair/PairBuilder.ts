import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import { IBuilder } from "../../app/interfaces/IBuilder";
import { PairController } from "./PairController";

export class PairBuilder implements IBuilder {
  public static readonly BASE_ROUTE: string = "pair";

  public readonly router: Router;

  private readonly mController: PairController;

  constructor() {
    this.router = Router();
    this.mController = new PairController();
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: PairBuilder.BASE_ROUTE, route: "/" },
      Method.POST,
      this.mController.postPair.bind(this.mController),
    );
  }
}
