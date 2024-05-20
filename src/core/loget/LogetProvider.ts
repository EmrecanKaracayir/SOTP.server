import { QueryResult } from "pg";
import { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import { IProvider } from "../../app/interfaces/IProvider";
import { BranchModel } from "../../app/models/BranchModel";
import { EmployeeModel } from "../../app/models/EmployeeModel";
import { BtMacModel } from "../../app/models/BtMacModel";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { DocumentModel } from "../../app/models/DocumentModel";

export class LogetProvider implements IProvider {
  public async getAccount(
    username: string,
  ): Promise<ProviderResponse<EmployeeModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results: QueryResult = await DbConstants.POOL.query(
        Queries.GET_ACCOUNT$UNAME,
        [username],
      );
      const record: unknown = results.rows[0];
      if (!record) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(
        EmployeeModel.fromRecord(record),
      );
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getBranch(
    branchId: number,
  ): Promise<ProviderResponse<BranchModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results: QueryResult = await DbConstants.POOL.query(
        Queries.GET_BRANCH$BID,
        [branchId],
      );
      const record: unknown = results.rows[0];
      if (!record) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(
        BranchModel.fromRecord(record),
      );
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getBranchBtMacs(
    branchId: number,
  ): Promise<ProviderResponse<BtMacModel[] | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results: QueryResult = await DbConstants.POOL.query(
        Queries.GET_BT_MACS$BID,
        [branchId],
      );
      const record: unknown[] = results.rows;
      if (!record) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(
        BtMacModel.fromRecords(record),
      );
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getDocuments(
    branchId: number,
  ): Promise<ProviderResponse<DocumentModel[] | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results: QueryResult = await DbConstants.POOL.query(
        Queries.GET_DOCUMENTS$BID,
        [branchId],
      );
      const records: unknown[] = results.rows;
      if (!records) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(
        DocumentModel.fromRecords(records),
      );
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}

enum Queries {
  GET_ACCOUNT$UNAME = `SELECT * FROM "Employee" WHERE "username" = $1;`,
  GET_BRANCH$BID = `SELECT * FROM "Branch" WHERE "branchId" = $1;`,
  GET_BT_MACS$BID = `SELECT "btMac" FROM "BtMacsView" WHERE "branchId" = $1;`,
  GET_DOCUMENTS$BID = `SELECT "content" FROM "Document" WHERE "branchId" = $1;`,
}
