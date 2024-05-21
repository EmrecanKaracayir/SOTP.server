import { QueryResult } from "pg";
import { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import { IProvider } from "../../app/interfaces/IProvider";
import { AccountModel } from "../../app/models/AccountModel";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { PairDocModel } from "../../app/models/PairDocModel";

export class DecryptProvider implements IProvider {
  public async getAccount(
    accountId: number,
  ): Promise<ProviderResponse<AccountModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results: QueryResult = await DbConstants.POOL.query(
        Queries.GET_ACCOUNT$AID,
        [accountId],
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

  public async getPairAccount(
    pairUsername: string,
  ): Promise<ProviderResponse<AccountModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results: QueryResult = await DbConstants.POOL.query(
        Queries.GET_PAIR_ACCOUNT$UNAME,
        [pairUsername],
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

  public async validateSotp(
    accountId: number,
    sotp: string,
  ): Promise<ProviderResponse<boolean>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results: QueryResult = await DbConstants.POOL.query(
        Queries.VALIDATE_SOTP$AID,
        [accountId, sotp],
      );
      const record: unknown = results.rows[0];
      if (!record) {
        return await ResponseUtil.providerResponse(false);
      }
      return await ResponseUtil.providerResponse(true);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}

enum Queries {
  GET_ACCOUNT$AID = `SELECT * FROM "Account" WHERE "accountId" = $1;`,
  GET_PAIR_ACCOUNT$UNAME = `SELECT * FROM "Account" WHERE "username" = $1;`,
  GET_PAIR_DOC$AID = `SELECT * FROM "PairDocView" WHERE "firstAccountId" = $1 OR "secondAccountId" = $1;`,
  VALIDATE_SOTP$AID = `SELECT * FROM "Account" WHERE "accountId" = $1 AND "sotp" = $2;`,
}
