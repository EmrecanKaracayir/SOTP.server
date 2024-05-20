import { ControllerResponse, ManagerResponse } from "../../@types/responses";
import { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { IController } from "../../app/interfaces/IController";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { LogetManager } from "./LogetManager";
import { LogetRequest } from "./schemas/LogetRequest";
import { LogetResponse } from "./schemas/LogetResponse";

export class LogetController implements IController {
  private readonly mManager: LogetManager;

  constructor() {
    this.mManager = new LogetManager();
  }

  public async postLogin(
    req: ExpressRequest,
    res: ControllerResponse<LogetResponse | null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<LogetResponse | null> | void> {
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
      if (!LogetRequest.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_BODY)],
          null,
        );
      }
      const blueprintData: LogetRequest = protovalidData;
      // V3: Physical validation
      const validationErrors: ClientError[] =
        LogetRequest.getValidationErrors(blueprintData);
      if (validationErrors.length > 0) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          validationErrors,
          null,
        );
      }
      const validatedData: LogetRequest = blueprintData;
      // HAND OVER TO MANAGER
      const managerResponse: ManagerResponse<LogetResponse | null> =
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
