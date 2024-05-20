import { IModel } from "../app/interfaces/IModel";
import { IResponse } from "../app/interfaces/IResponse";
import { ClientError } from "../app/schemas/ClientError";
import { HttpStatus } from "../app/schemas/HttpStatus";
import { ServerError } from "../app/schemas/ServerError";
import { ExpressResponse } from "./wrappers";

export type ControllerResponse<D extends IResponse | null> = ExpressResponse<{
  httpStatus: HttpStatus;
  serverError: ServerError | null;
  clientErrors: ClientError[];
  data: D;
}>;

export type MiddlewareResponse = ControllerResponse<null>;

export type ManagerResponse<D extends IResponse | null> = {
  httpStatus: HttpStatus;
  serverError: ServerError | null;
  clientErrors: ClientError[];
  data: D;
};

export type ProviderResponse<D extends IModel | boolean | null> = {
  data: D;
};
