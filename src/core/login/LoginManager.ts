import { ManagerResponse, ProviderResponse } from "../../@types/responses";
import { IManager } from "../../app/interfaces/IManager";
import { AccountModel } from "../../app/models/AccountModel";
import type { PairDocModel } from "../../app/models/PairDocModel";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { RandomUtil } from "../../app/utils/RandomUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { LoginProvider } from "./LoginProvider";
import { LoginRequest } from "./schemas/LoginRequest";
import { LoginResponse, PairDocData } from "./schemas/LoginResponse";

export class LoginManager implements IManager {
  private readonly mProvider: LoginProvider;

  constructor() {
    this.mProvider = new LoginProvider();
  }

  public async postLogin(
    validatedData: LoginRequest,
  ): Promise<ManagerResponse<LoginResponse | null>> {
    // Try to get account
    const providerResponse: ProviderResponse<AccountModel | null> =
      await this.mProvider.getAccount(validatedData.username);
    // Check response
    if (!providerResponse.data) {
      // No account found
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_ACCOUNT_FOUND)],
        null,
      );
    }
    // Account found, check password
    if (validatedData.password !== providerResponse.data.password) {
      // Passwords don't match
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.UNAUTHORIZED),
        null,
        [new ClientError(ClientErrorCode.INCORRECT_PASSWORD)],
        null,
      );
    }
    // Passwords match, create sharedOtp
    const sharedOtp: string = RandomUtil.generateRandomNumberString(6);
    // Assign sharedOtp to account
    await this.mProvider.assignSharedOtp(
      providerResponse.data.accountId,
      sharedOtp,
    );
    // Get pairDoc
    const providerResponsePairDoc: ProviderResponse<PairDocModel | null> =
      await this.mProvider.getPairDoc(providerResponse.data.accountId);
    // Prepare pairDoc data
    let pairDocData: PairDocData | null = null;
    if (providerResponsePairDoc.data) {
      // Check if we are first account return opposite
      if (
        providerResponse.data.accountId ===
        providerResponsePairDoc.data.firstAccountId
      ) {
        pairDocData = new PairDocData(
          providerResponsePairDoc.data.secondUsername,
          providerResponsePairDoc.data.documentId,
          providerResponsePairDoc.data.content,
        );
      } else {
        pairDocData = new PairDocData(
          providerResponsePairDoc.data.firstUsername,
          providerResponsePairDoc.data.documentId,
          providerResponsePairDoc.data.content,
        );
      }
    }
    // Login success, return data
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      new LoginResponse(
        providerResponse.data.accountId,
        sharedOtp,
        pairDocData,
      ),
    );
  }
}
