import { ClientErrorCodeMap } from "../../@types/maps";
import { IResponse } from "../interfaces/IResponse";
import { AccountRules } from "../rules/AccountRules";

export class ClientError implements IResponse {
  public readonly code: number;
  public readonly message: string;

  constructor(clientErrorCode: ClientErrorCode) {
    this.code = clientErrorCode;
    this.message = clientErrorMessages[clientErrorCode];
  }
}

export enum ClientErrorCode {
  // CONTRACT ERRORS (1XXXX - 2XXXX)
  //  *  1XXXX: Schema errors
  //  *  *  100XX: Body errors
  MISSING_BODY = 10000,
  INVALID_BODY = 10001,
  //  *  *  101XX: Parameter errors
  //  *  *  102XX: Query errors
  //  *  2XXXX: Method errors
  METHOD_NOT_ALLOWED = 20000,

  // AUTHORIZATION ERRORS (3XXXX - 5XXXX)
  //  *  3XXXX: Token errors
  //  *  4XXXX: Session errors
  //  *  5XXXX: Permission errors

  // VALIDATION ERRORS (6XXXX - 7XXXX)
  //  *  6XXXX: Length errors
  INVALID_USERNAME_LENGTH = 60000,
  INVALID_PASSWORD_LENGTH = 60001,
  //  *  7XXXX: Content errors
  INVALID_USERNAME_CONTENT = 70002,
  INVALID_PASSWORD_CONTENT = 70003,

  // REQUEST ERRORS (8XXXX - 9XXXX)
  //  *  8XXXX: Route errors
  //  *  *  800XX: /loget errors
  NO_ACCOUNT_FOUND = 80004,
  INCORRECT_PASSWORD = 80005,
  NO_BRANCH_FOUND = 80006,
  INVALID_PHYSICAL_LOCATION = 80007,
  BRANCH_HAS_NO_EMPLOYEES = 80008,
  INVALID_LOGICAL_LOCATION = 80009,
  BRANCH_HAS_NO_DOCUMENTS = 80010,
  //  *  9XXXX: Catch-all errors
  RESOURCE_NOT_FOUND = 90000,
}

const clientErrorMessages: ClientErrorCodeMap<string> = {
  // CONTRACT ERRORS (1XXXX - 2XXXX)
  //  *  1XXXX: Schema errors
  //  *  *  100XX: Body errors
  [ClientErrorCode.MISSING_BODY]: "Request body was not provided.",
  [ClientErrorCode.INVALID_BODY]: "Provided request body was invalid.",
  //  *  *  101XX: Parameter errors
  //  *  *  102XX: Query errors
  //  *  2XXXX: Method errors
  [ClientErrorCode.METHOD_NOT_ALLOWED]: "Requested method is not allowed.",

  // AUTHORIZATION ERRORS (3XXXX - 5XXXX)
  //  *  3XXXX: Token errors
  //  *  4XXXX: Session errors
  //  *  5XXXX: Permission errors

  // VALIDATION ERRORS (6XXXX - 7XXXX)
  //  *  6XXXX: Length errors
  [ClientErrorCode.INVALID_USERNAME_LENGTH]: `Provided username wasn't in the length range of ${AccountRules.USERNAME_MIN_LENGTH} to ${AccountRules.USERNAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_PASSWORD_LENGTH]: `Provided password wasn't in the length range of ${AccountRules.PASSWORD_MIN_LENGTH} to ${AccountRules.PASSWORD_MAX_LENGTH}.`,
  //  *  7XXXX: Content errors
  [ClientErrorCode.INVALID_USERNAME_CONTENT]:
    "Provided username contained invalid characters.",
  [ClientErrorCode.INVALID_PASSWORD_CONTENT]:
    "Provided password didn't satisfy the requirements. A password must contain at least one lowercase letter, one uppercase letter, one digit and one special character.",

  // REQUEST ERRORS (8XXXX - 9XXXX)
  //  *  8XXXX: Route errors
  //  *  *  800XX: /loget errors
  [ClientErrorCode.NO_ACCOUNT_FOUND]:
    "No account was found with the provided username.",
  [ClientErrorCode.INCORRECT_PASSWORD]: "Provided password was incorrect.",
  [ClientErrorCode.NO_BRANCH_FOUND]:
    "No branch was found with the registered employee.",
  [ClientErrorCode.INVALID_PHYSICAL_LOCATION]:
    "Provided physical location was invalid.",
  [ClientErrorCode.BRANCH_HAS_NO_EMPLOYEES]:
    "Branch has no employees registered.",
  [ClientErrorCode.INVALID_LOGICAL_LOCATION]:
    "Provided logical location was invalid.",
  [ClientErrorCode.BRANCH_HAS_NO_DOCUMENTS]: "Branch has no documents to get.",
  //  *  9XXXX: Catch-all errors
  [ClientErrorCode.RESOURCE_NOT_FOUND]:
    "The requested resource couldn't be found.",
};
