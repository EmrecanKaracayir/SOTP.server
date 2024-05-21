import { ControllerResponse, ManagerResponse } from "../../@types/responses";
import { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { IController } from "../../app/interfaces/IController";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { DecryptManager } from "./DecryptManager";
import { DecryptRequest } from "./schemas/DecryptRequest";
import type { DecryptResponse } from "./schemas/DecryptResponse";

export class DecryptController implements IController {
  private readonly mManager: DecryptManager;

  constructor() {
    this.mManager = new DecryptManager();
  }

  public async postDecrypt(
    req: ExpressRequest,
    res: ControllerResponse<DecryptResponse | null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<DecryptResponse | null> | void> {
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
      if (!DecryptRequest.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_BODY)],
          null,
        );
      }
      const blueprintData: DecryptRequest = protovalidData;
      // V3: Physical validation
      const validationErrors: ClientError[] =
        DecryptRequest.getValidationErrors(blueprintData);
      if (validationErrors.length > 0) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          validationErrors,
          null,
        );
      }
      const validatedData: DecryptRequest = blueprintData;
      // HAND OVER TO MANAGER
      const managerResponse: ManagerResponse<DecryptResponse | null> =
        await this.mManager.postDecrypt(validatedData);
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
