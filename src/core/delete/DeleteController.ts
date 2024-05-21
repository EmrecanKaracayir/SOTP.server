import { ControllerResponse, ManagerResponse } from "../../@types/responses";
import { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { IController } from "../../app/interfaces/IController";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { DeleteManager } from "./DeleteManager";
import { DeleteRequest } from "./schemas/DeleteRequest";
import { DeleteResponse } from "./schemas/DeleteResponse";

export class DeleteController implements IController {
  private readonly mManager: DeleteManager;

  constructor() {
    this.mManager = new DeleteManager();
  }

  public async postDelete(
    req: ExpressRequest,
    res: ControllerResponse<DeleteResponse | null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<DeleteResponse | null> | void> {
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
      if (!DeleteRequest.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_BODY)],
          null,
        );
      }
      const blueprintData: DeleteRequest = protovalidData;
      // V3: Physical validation
      const validationErrors: ClientError[] =
        DeleteRequest.getValidationErrors(blueprintData);
      if (validationErrors.length > 0) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          validationErrors,
          null,
        );
      }
      const validatedData: DeleteRequest = blueprintData;
      // HAND OVER TO MANAGER
      const managerResponse: ManagerResponse<DeleteResponse | null> =
        await this.mManager.postDelete(validatedData);
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
