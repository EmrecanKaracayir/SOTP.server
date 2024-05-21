import type { IModel } from "../interfaces/IModel";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
} from "../schemas/ServerError";

export class PairDocModel implements IModel {
  private constructor(
    public readonly pairId: number,
    public readonly firstAccountId: number,
    public readonly firstUsername: string,
    public readonly secondAccountId: number,
    public readonly secondUsername: string,
    public readonly firstKeySegment: string,
    public readonly secondKeySegment: string,
    public readonly documentId: number,
    public readonly content: string,
  ) {}

  public static fromRecord(record: unknown): PairDocModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new PairDocModel(
      record.pairId,
      record.firstAccountId,
      record.firstUsername,
      record.secondAccountId,
      record.secondUsername,
      record.firstKeySegment,
      record.secondKeySegment,
      record.documentId,
      record.content,
    );
  }

  public static fromRecords(records: unknown[]): PairDocModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map(
      (record: unknown): PairDocModel => this.fromRecord(record),
    );
  }

  private static isValidModel(data: unknown): data is PairDocModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model: PairDocModel = data as PairDocModel;
    return (
      typeof model.pairId === "number" &&
      typeof model.firstAccountId === "number" &&
      typeof model.firstUsername === "string" &&
      typeof model.secondAccountId === "number" &&
      typeof model.secondUsername === "string" &&
      typeof model.firstKeySegment === "string" &&
      typeof model.secondKeySegment === "string" &&
      typeof model.documentId === "number" &&
      typeof model.content === "string"
    );
  }

  private static areValidModels(data: unknown[]): data is PairDocModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
