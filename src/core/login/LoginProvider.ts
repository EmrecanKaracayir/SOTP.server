import { QueryResult } from "pg";
import { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import { IProvider } from "../../app/interfaces/IProvider";
import { AccountModel } from "../../app/models/AccountModel";
import { BtMacModel } from "../../app/models/BtMacModel";
import { DocumentModel } from "../../app/models/DocumentModel";
import { PairDocModel } from "../../app/models/PairDocModel";
import { ResponseUtil } from "../../app/utils/ResponseUtil";

export class LoginProvider implements IProvider {
  public async getAccount(
    username: string,
  ): Promise<ProviderResponse<AccountModel | null>> {
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
        AccountModel.fromRecord(record),
      );
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async assignSharedOtp(
    accountId: number,
    sharedOtp: string,
  ): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await DbConstants.POOL.query(Queries.ASSIGN_SHARED_OTP$SOTP_$AID, [
        sharedOtp,
        accountId,
      ]);
      await DbConstants.POOL.query(DbConstants.COMMIT);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getPairDoc(
    accountId: number,
  ): Promise<ProviderResponse<PairDocModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results: QueryResult = await DbConstants.POOL.query(
        Queries.GET_PAIR_DOC$AID,
        [accountId],
      );
      const record: unknown = results.rows[0];
      if (!record) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(
        PairDocModel.fromRecord(record),
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
  GET_ACCOUNT$UNAME = `SELECT * FROM "Account" WHERE "username" = $1;`,
  ASSIGN_SHARED_OTP$SOTP_$AID = `UPDATE "Account" SET "sharedOtp" = $1 WHERE "accountId" = $2;`,
  GET_PAIR_DOC$AID = `SELECT * FROM "PairDocView" WHERE "firstAccountId" = $1 OR "secondAccountId" = $1;`,
  GET_BT_MACS$BID = `SELECT "btMac" FROM "BtMacsView" WHERE "branchId" = $1;`,
  GET_DOCUMENTS$BID = `SELECT "content" FROM "Document" WHERE "branchId" = $1;`,
}
