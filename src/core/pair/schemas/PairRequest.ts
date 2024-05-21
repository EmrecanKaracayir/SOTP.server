import { IRequest } from "../../../app/interfaces/IRequest";
import type { ClientError } from "../../../app/schemas/ClientError";
import { UsernameValidator } from "../../../app/validators/UsernameValidator";

export class PairRequest implements IRequest {
  constructor(
    public readonly accountId: number,
    public readonly pairUsername: string,
    public readonly documentContent: string,
  ) {}

  public static isBlueprint(obj: unknown): obj is PairRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint: PairRequest = obj as PairRequest;
    return (
      typeof blueprint.accountId === "number" &&
      typeof blueprint.pairUsername === "string" &&
      typeof blueprint.documentContent === "string"
    );
  }

  public static getValidationErrors(blueprintData: PairRequest): ClientError[] {
    const validationErrors: ClientError[] = new Array<ClientError>();
    UsernameValidator.validate(blueprintData.pairUsername, validationErrors);
    return validationErrors;
  }
}
