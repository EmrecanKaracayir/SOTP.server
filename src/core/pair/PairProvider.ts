import { QueryResult } from "pg";
import { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import { IProvider } from "../../app/interfaces/IProvider";
import { AccountModel } from "../../app/models/AccountModel";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { DocumentIdModel } from "../../app/models/DocumentIdModel";

export class PairProvider implements IProvider {
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

  public async createPairDoc(
    firstAccountId: number,
    secondAccountId: number,
    documentContent: string,
    firstKeySegment: string,
    secondKeySegment: string,
  ): Promise<ProviderResponse<boolean>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const documentResults: QueryResult = await DbConstants.POOL.query(
        Queries.CREATE_DOCUMENT$CONT,
        [documentContent],
      );
      const documentRecord: unknown = documentResults.rows[0];
      if (!documentRecord) {
        return await ResponseUtil.providerResponse(false);
      }
      const documentId: number =
        DocumentIdModel.fromRecord(documentRecord).documentId;
      await DbConstants.POOL.query(
        Queries.CREATE_PAIR$AID_$PAID_$DID_$FKS_$SKS,
        [
          firstAccountId,
          secondAccountId,
          documentId,
          firstKeySegment,
          secondKeySegment,
        ],
      );
      await DbConstants.POOL.query(DbConstants.COMMIT);
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
  ASSIGN_SHARED_OTP$SOTP_$AID = `UPDATE "Account" SET "sharedOtp" = $1 WHERE "accountId" = $2;`,
  GET_PAIR_DOC$AID = `SELECT * FROM "PairDocView" WHERE "firstAccountId" = $1 OR "secondAccountId" = $1;`,
  CREATE_DOCUMENT$CONT = `INSERT INTO "Document" ("content") VALUES ($1) RETURNING "documentId";`,
  CREATE_PAIR$AID_$PAID_$DID_$FKS_$SKS = `INSERT INTO "Pair" ("firstAccountId", "secondAccountId", "documentId", "firstKeySegment", "secondKeySegment") VALUES ($1, $2, $3, $4, $5);`,
}
