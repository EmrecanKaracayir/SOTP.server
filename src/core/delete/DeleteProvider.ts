import { QueryResult } from "pg";
import { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import { IProvider } from "../../app/interfaces/IProvider";
import { AccountModel } from "../../app/models/AccountModel";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { DocumentIdModel } from "../../app/models/DocumentIdModel";

export class DeleteProvider implements IProvider {
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

  public async deletePairDoc(
    accountId: number,
  ): Promise<ProviderResponse<boolean>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const documentResult: QueryResult = await DbConstants.POOL.query(
        Queries.DELETE_PAIR$AID,
        [accountId],
      );
      const documentRecord: unknown = documentResult.rows[0];
      if (!documentRecord) {
        return await ResponseUtil.providerResponse(false);
      }
      const documentId: number =
        DocumentIdModel.fromRecord(documentRecord).documentId;
      await DbConstants.POOL.query(Queries.DELETE_DOCUMENT$DID, [documentId]);
      return await ResponseUtil.providerResponse(true);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}

enum Queries {
  GET_ACCOUNT$AID = `SELECT * FROM "Account" WHERE "accountId" = $1;`,
  DELETE_PAIR$AID = `DELETE FROM "Pair" WHERE "firstAccountId" = $1 OR "secondAccountId" = $1 RETURNING "documentId";`,
  DELETE_DOCUMENT$DID = `DELETE FROM "Document" WHERE "documentId" = $1;`,
}
