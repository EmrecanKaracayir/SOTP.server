import { ControllerResponse, ManagerResponse } from "../../@types/responses";
import { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { IController } from "../../app/interfaces/IController";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { PairManager } from "./PairManager";
import { PairRequest } from "./schemas/PairRequest";
import type { PairResponse } from "./schemas/PairResponse";

export class PairController implements IController {
  private readonly mManager: PairManager;

  constructor() {
    this.mManager = new PairManager();
  }

  public async postPair(
    req: ExpressRequest,
    res: ControllerResponse<PairResponse | null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<PairResponse | null> | void> {
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
      if (!PairRequest.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_BODY)],
          null,
        );
      }
      const blueprintData: PairRequest = protovalidData;
      // V3: Physical validation
      const validationErrors: ClientError[] =
        PairRequest.getValidationErrors(blueprintData);
      if (validationErrors.length > 0) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          validationErrors,
          null,
        );
      }
      const validatedData: PairRequest = blueprintData;
      // HAND OVER TO MANAGER
      const managerResponse: ManagerResponse<PairResponse | null> =
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
