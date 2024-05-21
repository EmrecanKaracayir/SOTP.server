import { IRequest } from "../../../app/interfaces/IRequest";
import type { ClientError } from "../../../app/schemas/ClientError";
import { UsernameValidator } from "../../../app/validators/UsernameValidator";

export class DecryptRequest implements IRequest {
  constructor(
    public readonly accountId: number,
    public readonly pairUsername: string,
    public readonly pairSharedOtp: string,
  ) {}

  public static isBlueprint(obj: unknown): obj is DecryptRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint: DecryptRequest = obj as DecryptRequest;
    return (
      typeof blueprint.accountId === "number" &&
      typeof blueprint.pairUsername === "string" &&
      typeof blueprint.pairSharedOtp === "string"
    );
  }

  public static getValidationErrors(
    blueprintData: DecryptRequest,
  ): ClientError[] {
    const validationErrors: ClientError[] = new Array<ClientError>();
    UsernameValidator.validate(blueprintData.pairUsername, validationErrors);
    return validationErrors;
  }
}
