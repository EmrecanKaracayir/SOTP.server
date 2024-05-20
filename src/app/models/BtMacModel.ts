import type { IModel } from "../interfaces/IModel";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
} from "../schemas/ServerError";

export class BtMacModel implements IModel {
  private constructor(public readonly btMac: string) {}

  public static fromRecord(record: unknown): BtMacModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new BtMacModel(record.btMac);
  }

  public static fromRecords(records: unknown[]): BtMacModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map(
      (record: unknown): BtMacModel => this.fromRecord(record),
    );
  }

  private static isValidModel(data: unknown): data is BtMacModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model: BtMacModel = data as BtMacModel;
    return typeof model.btMac === "string";
  }

  private static areValidModels(data: unknown[]): data is BtMacModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
