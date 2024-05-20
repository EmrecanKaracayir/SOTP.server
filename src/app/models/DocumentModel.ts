import type { IModel } from "../interfaces/IModel";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
} from "../schemas/ServerError";

export class DocumentModel implements IModel {
  private constructor(public readonly content: string) {}

  public static fromRecord(record: unknown): DocumentModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new DocumentModel(record.content);
  }

  public static fromRecords(records: unknown[]): DocumentModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map(
      (record: unknown): DocumentModel => this.fromRecord(record),
    );
  }

  private static isValidModel(data: unknown): data is DocumentModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model: DocumentModel = data as DocumentModel;
    return typeof model.content === "string";
  }

  private static areValidModels(data: unknown[]): data is DocumentModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
