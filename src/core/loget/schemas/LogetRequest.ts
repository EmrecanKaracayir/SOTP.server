import { IRequest } from "../../../app/interfaces/IRequest";
import type { ClientError } from "../../../app/schemas/ClientError";
import { PasswordValidator } from "../../../app/validators/PasswordValidator";
import { UsernameValidator } from "../../../app/validators/UsernameValidator";

export class LogetRequest implements IRequest {
  constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly btMacs: string[],
  ) {}

  public static isBlueprint(obj: unknown): obj is LogetRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint: LogetRequest = obj as LogetRequest;
    return (
      typeof blueprint.username === "string" &&
      typeof blueprint.password === "string" &&
      typeof blueprint.latitude === "number" &&
      typeof blueprint.longitude === "number" &&
      Array.isArray(blueprint.btMacs) &&
      blueprint.btMacs.every((btMac: unknown) => typeof btMac === "string")
    );
  }

  public static getValidationErrors(
    blueprintData: LogetRequest,
  ): ClientError[] {
    const validationErrors: ClientError[] = new Array<ClientError>();
    UsernameValidator.validate(blueprintData.username, validationErrors);
    PasswordValidator.validate(blueprintData.password, validationErrors);
    return validationErrors;
  }
}
