import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import { IBuilder } from "../../app/interfaces/IBuilder";
import { DeleteController } from "./DeleteController";

export class DeleteBuilder implements IBuilder {
  public static readonly BASE_ROUTE: string = "delete";

  public readonly router: Router;

  private readonly mController: DeleteController;

  constructor() {
    this.router = Router();
    this.mController = new DeleteController();
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: DeleteBuilder.BASE_ROUTE, route: "/" },
      Method.POST,
      this.mController.postDelete.bind(this.mController),
    );
  }
}
