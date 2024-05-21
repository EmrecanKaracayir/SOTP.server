import { ManagerResponse, ProviderResponse } from "../../@types/responses";
import { EncryptionHelper } from "../../app/helpers/EncryptionHelper";
import { IManager } from "../../app/interfaces/IManager";
import { AccountModel } from "../../app/models/AccountModel";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { PairProvider } from "./PairProvider";
import type { PairRequest } from "./schemas/PairRequest";
import { PairResponse } from "./schemas/PairResponse";

export class PairManager implements IManager {
  private readonly mProvider: PairProvider;

  constructor() {
    this.mProvider = new PairProvider();
  }

  public async postPair(
    validatedData: PairRequest,
  ): Promise<ManagerResponse<PairResponse | null>> {
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
    // Encrypt documentContent with AES
    const key: Buffer = EncryptionHelper.generateKey();
    const encryptedContent: string = EncryptionHelper.encrypt(
      validatedData.documentContent,
      key,
    );
    // Segment key into two parts using Shamir secret sharing
    const keyParts: Buffer[] = await EncryptionHelper.splitKey(key);
    // Create Pair
    if (
      !(await this.mProvider.createPairDoc(
        providerResponse.data.accountId,
        providerResponsePair.data.accountId,
        encryptedContent,
        keyParts[0]!.toString("base64"),
        keyParts[1]!.toString("base64"),
      ))
    ) {
      throw new Error("Failed to create pair!");
    }
    // Pairing success, return true
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      new PairResponse(true),
    );
  }
}
