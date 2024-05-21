import { ManagerResponse, ProviderResponse } from "../../@types/responses";
import { EncryptionHelper } from "../../app/helpers/EncryptionHelper";
import { IManager } from "../../app/interfaces/IManager";
import { AccountModel } from "../../app/models/AccountModel";
import type { PairDocModel } from "../../app/models/PairDocModel";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { DecryptProvider } from "./DecryptProvider";
import type { DecryptRequest } from "./schemas/DecryptRequest";
import { DecryptResponse } from "./schemas/DecryptResponse";

export class DecryptManager implements IManager {
  private readonly mProvider: DecryptProvider;

  constructor() {
    this.mProvider = new DecryptProvider();
  }

  public async postDecrypt(
    validatedData: DecryptRequest,
  ): Promise<ManagerResponse<DecryptResponse | null>> {
    // Try to get account
    const providerResponse: ProviderResponse<AccountModel | null> =
      await this.mProvider.getAccount(validatedData.accountId);
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
    // Try to get pair account
    const providerResponsePair: ProviderResponse<AccountModel | null> =
      await this.mProvider.getPairAccount(validatedData.pairUsername);
    // Check response
    if (!providerResponsePair.data) {
      // No account found
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_PAIR_ACCOUNT_FOUND)],
        null,
      );
    }
    // Try to get pairDoc
    const providerResponsePairDoc: ProviderResponse<PairDocModel | null> =
      await this.mProvider.getPairDoc(providerResponse.data.accountId);
    if (!providerResponsePairDoc.data) {
      // No pairDoc found
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_PAIR_FOUND)],
        null,
      );
    }
    // Validate pair sotp
    const providerResponseSotp: ProviderResponse<boolean> =
      await this.mProvider.validateSotp(
        providerResponsePair.data.accountId,
        validatedData.pairSharedOtp,
      );
    if (!providerResponseSotp.data) {
      // Invalid sotp
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.UNAUTHORIZED),
        null,
        [new ClientError(ClientErrorCode.INVALID_PAIR_SOTP)],
        null,
      );
    }
    // SOTP valid, combine key segments
    const key: Buffer = await EncryptionHelper.combineKeySegments(
      Buffer.from(providerResponsePairDoc.data.firstKeySegment, "base64"),
      Buffer.from(providerResponsePairDoc.data.secondKeySegment, "base64"),
    );
    // Decrypt content
    const decryptedContent: string = EncryptionHelper.decrypt(
      providerResponsePairDoc.data.content,
      key,
    );
    // Return data
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      new DecryptResponse(decryptedContent),
    );
  }
}
