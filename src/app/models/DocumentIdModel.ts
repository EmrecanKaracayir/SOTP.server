import type { IModel } from "../interfaces/IModel";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
} from "../schemas/ServerError";

export class DocumentIdModel implements IModel {
  private constructor(public readonly documentId: number) {}

  public static fromRecord(record: unknown): DocumentIdModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new DocumentIdModel(record.documentId);
  }

  public static fromRecords(records: unknown[]): DocumentIdModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map(
      (record: unknown): DocumentIdModel => this.fromRecord(record),
    );
  }

  private static isValidModel(data: unknown): data is DocumentIdModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model: DocumentIdModel = data as DocumentIdModel;
    return typeof model.documentId === "number";
  }

  private static areValidModels(data: unknown[]): data is DocumentIdModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
