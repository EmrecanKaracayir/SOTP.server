import type { IModel } from "../interfaces/IModel";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
} from "../schemas/ServerError";

export class BranchModel implements IModel {
  private constructor(
    public readonly branchId: number,
    public readonly name: string,
    public readonly companyId: number,
    public readonly y0: number,
    public readonly y1: number,
    public readonly x0: number,
    public readonly x1: number,
  ) {}

  public static fromRecord(record: unknown): BranchModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new BranchModel(
      record.branchId,
      record.name,
      record.companyId,
      record.y0,
      record.y1,
      record.x0,
      record.x1,
    );
  }

  public static fromRecords(records: unknown[]): BranchModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map(
      (record: unknown): BranchModel => this.fromRecord(record),
    );
  }

  private static isValidModel(data: unknown): data is BranchModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model: BranchModel = data as BranchModel;
    return (
      typeof model.branchId === "number" &&
      typeof model.name === "string" &&
      typeof model.companyId === "number" &&
      typeof model.y0 === "number" &&
      typeof model.y1 === "number" &&
      typeof model.x0 === "number" &&
      typeof model.x1 === "number"
    );
  }

  private static areValidModels(data: unknown[]): data is BranchModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
