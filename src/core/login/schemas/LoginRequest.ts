import { IRequest } from "../../../app/interfaces/IRequest";
import type { ClientError } from "../../../app/schemas/ClientError";
import { PasswordValidator } from "../../../app/validators/PasswordValidator";
import { UsernameValidator } from "../../../app/validators/UsernameValidator";

export class LoginRequest implements IRequest {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}

  public static isBlueprint(obj: unknown): obj is LoginRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint: LoginRequest = obj as LoginRequest;
    return (
      typeof blueprint.username === "string" &&
      typeof blueprint.password === "string"
    );
  }

  public static getValidationErrors(
    blueprintData: LoginRequest,
  ): ClientError[] {
    const validationErrors: ClientError[] = new Array<ClientError>();
    UsernameValidator.validate(blueprintData.username, validationErrors);
    PasswordValidator.validate(blueprintData.password, validationErrors);
    return validationErrors;
  }
}
