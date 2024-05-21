import { IRequest } from "../../../app/interfaces/IRequest";
import type { ClientError } from "../../../app/schemas/ClientError";

export class DeleteRequest implements IRequest {
  constructor(public readonly accountId: number) {}

  public static isBlueprint(obj: unknown): obj is DeleteRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint: DeleteRequest = obj as DeleteRequest;
    return typeof blueprint.accountId === "number";
  }

  public static getValidationErrors(
    blueprintData: DeleteRequest,
  ): ClientError[] {
    const validationErrors: ClientError[] = new Array<ClientError>();
    blueprintData.accountId;
    return validationErrors;
  }
}
