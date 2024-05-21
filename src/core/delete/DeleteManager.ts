import { ManagerResponse, ProviderResponse } from "../../@types/responses";
import { IManager } from "../../app/interfaces/IManager";
import { AccountModel } from "../../app/models/AccountModel";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { DeleteProvider } from "./DeleteProvider";
import { DeleteRequest } from "./schemas/DeleteRequest";
import { DeleteResponse } from "./schemas/DeleteResponse";

export class DeleteManager implements IManager {
  private readonly mProvider: DeleteProvider;

  constructor() {
    this.mProvider = new DeleteProvider();
  }

  public async postDelete(
    validatedData: DeleteRequest,
  ): Promise<ManagerResponse<DeleteResponse | null>> {
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
    // Account found, delete pairDoc
    const providerResponseDelete: ProviderResponse<boolean> =
      await this.mProvider.deletePairDoc(providerResponse.data.accountId);
    if (!providerResponseDelete.data) {
      throw new Error("Failed to delete pair!");
    }
    // Deletion success, return true
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      new DeleteResponse(true),
    );
  }
}
