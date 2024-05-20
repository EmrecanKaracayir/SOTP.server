import type {
  ControllerResponse,
  ManagerResponse,
  MiddlewareResponse,
  ProviderResponse,
} from "../../@types/responses";
import { DbConstants } from "../constants/DbConstants";
import type { IModel } from "../interfaces/IModel";
import type { IResponse } from "../interfaces/IResponse";
import type { IUtil } from "../interfaces/IUtil";
import type { ClientError } from "../schemas/ClientError";
import type { HttpStatus } from "../schemas/HttpStatus";
import type { ServerError } from "../schemas/ServerError";

export class ResponseUtil implements IUtil {
  public static controllerResponse<DO extends IResponse | null, D extends DO>(
    res: ControllerResponse<DO>,
    httpStatus: HttpStatus,
    serverError: ServerError | null,
    clientErrors: ClientError[],
    data: D,
  ): ControllerResponse<DO> {
    return res.status(httpStatus.code).send({
      httpStatus,
      serverError,
      clientErrors,
      data,
    });
  }

  public static middlewareResponse(
    res: MiddlewareResponse,
    httpStatus: HttpStatus,
    serverError: ServerError | null,
    clientErrors: ClientError[],
  ): MiddlewareResponse {
    return this.controllerResponse(
      res,
      httpStatus,
      serverError,
      clientErrors,
      null,
    );
  }

  public static managerResponse<D extends IResponse | null>(
    httpStatus: HttpStatus,
    serverError: ServerError | null,
    clientErrors: ClientError[],
    data: D,
  ): ManagerResponse<D> {
    return {
      httpStatus,
      serverError,
      clientErrors,
      data,
    };
  }

  public static async providerResponse<D extends IModel | boolean | null>(
    data: D,
  ): Promise<ProviderResponse<D>> {
    await DbConstants.POOL.query(DbConstants.COMMIT);
    return {
      data,
    };
  }
}
