import { ControllerResponse, ManagerResponse } from "../../@types/responses";
import { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { IController } from "../../app/interfaces/IController";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { LoginManager } from "./LoginManager";
import { LoginRequest } from "./schemas/LoginRequest";
import { LoginResponse } from "./schemas/LoginResponse";

export class LoginController implements IController {
  private readonly mManager: LoginManager;

  constructor() {
    this.mManager = new LoginManager();
  }

  public async postLogin(
    req: ExpressRequest,
    res: ControllerResponse<LoginResponse | null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<LoginResponse | null> | void> {
    try {
      const preliminaryData: unknown = req.body;
      // V1: Existence validation
      if (!ProtoUtil.isProtovalid(preliminaryData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.MISSING_BODY)],
          null,
        );
      }
      const protovalidData: unknown = preliminaryData;
      // V2: Schematic validation
      if (!LoginRequest.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_BODY)],
          null,
        );
      }
      const blueprintData: LoginRequest = protovalidData;
      // V3: Physical validation
      const validationErrors: ClientError[] =
        LoginRequest.getValidationErrors(blueprintData);
      if (validationErrors.length > 0) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          validationErrors,
          null,
        );
      }
      const validatedData: LoginRequest = blueprintData;
      // HAND OVER TO MANAGER
      const managerResponse: ManagerResponse<LoginResponse | null> =
        await this.mManager.postLogin(validatedData);
      // Respond
      return res.status(managerResponse.httpStatus.code).send({
        httpStatus: managerResponse.httpStatus,
        serverError: managerResponse.serverError,
        clientErrors: managerResponse.clientErrors,
        data: managerResponse.data,
      });
    } catch (error) {
      return next(error);
    }
  }
}
