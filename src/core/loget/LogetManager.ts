import { ManagerResponse, ProviderResponse } from "../../@types/responses";
import { IManager } from "../../app/interfaces/IManager";
import type { BranchModel } from "../../app/models/BranchModel";
import type { BtMacModel } from "../../app/models/BtMacModel";
import type { DocumentModel } from "../../app/models/DocumentModel";
import { EmployeeModel } from "../../app/models/EmployeeModel";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ArrayUtil } from "../../app/utils/ArrayUtil";
import { NumberUtil } from "../../app/utils/NumberUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { LogetProvider } from "./LogetProvider";
import { LogetRequest } from "./schemas/LogetRequest";
import { LogetResponse } from "./schemas/LogetResponse";

export class LogetManager implements IManager {
  private readonly mProvider: LogetProvider;

  constructor() {
    this.mProvider = new LogetProvider();
  }

  public async postLogin(
    validatedData: LogetRequest,
  ): Promise<ManagerResponse<LogetResponse | null>> {
    // Try to get account
    const providerResponse: ProviderResponse<EmployeeModel | null> =
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
    // Passwords match, get branch
    const providerResponseBranch: ProviderResponse<BranchModel | null> =
      await this.mProvider.getBranch(providerResponse.data.branchId);

    if (!providerResponseBranch.data) {
      // No branch found
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_BRANCH_FOUND)],
        null,
      );
    }

    // Branch found, check physical location
    if (
      !NumberUtil.isBetween(
        validatedData.latitude,
        providerResponseBranch.data.y0,
        providerResponseBranch.data.y1,
      ) ||
      !NumberUtil.isBetween(
        validatedData.longitude,
        providerResponseBranch.data.x0,
        providerResponseBranch.data.x1,
      )
    ) {
      // Physical location invalid
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.UNAUTHORIZED),
        null,
        [new ClientError(ClientErrorCode.INVALID_PHYSICAL_LOCATION)],
        null,
      );
    }

    // Location in branch, get branch BT Mac list
    const providerResponseBtMacs: ProviderResponse<BtMacModel[] | null> =
      await this.mProvider.getBranchBtMacs(
        providerResponseBranch.data.branchId,
      );

    if (!providerResponseBtMacs.data) {
      // No BT Macs found
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BRANCH_HAS_NO_EMPLOYEES)],
        null,
      );
    }

    // BT Macs found, check logical location
    if (
      !ArrayUtil.hasAtLeastXCommonElements(
        validatedData.btMacs,
        providerResponseBtMacs.data.map(
          (btMacModel: BtMacModel) => btMacModel.btMac,
        ),
        1,
      )
    ) {
      // No BT Macs match
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.UNAUTHORIZED),
        null,
        [new ClientError(ClientErrorCode.INVALID_LOGICAL_LOCATION)],
        null,
      );
    }

    // All checks passed, get branch documents
    const providerResponseDocuments: ProviderResponse<DocumentModel[] | null> =
      await this.mProvider.getDocuments(providerResponseBranch.data.branchId);

    if (!providerResponseDocuments.data) {
      // No documents found
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BRANCH_HAS_NO_DOCUMENTS)],
        null,
      );
    }

    // Documents found, return documents
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      new LogetResponse(
        providerResponseDocuments.data.map(
          (documentModel: DocumentModel) => documentModel.content,
        ),
      ),
    );
  }
}
