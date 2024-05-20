import type { IModel } from "../interfaces/IModel";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
} from "../schemas/ServerError";

export class EmployeeModel implements IModel {
  private constructor(
    public readonly employeeId: number,
    public readonly username: string,
    public readonly password: string,
    public readonly branchId: number,
    public readonly btMac: string,
  ) {}

  public static fromRecord(record: unknown): EmployeeModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new EmployeeModel(
      record.employeeId,
      record.username,
      record.password,
      record.branchId,
      record.btMac,
    );
  }

  public static fromRecords(records: unknown[]): EmployeeModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map(
      (record: unknown): EmployeeModel => this.fromRecord(record),
    );
  }

  private static isValidModel(data: unknown): data is EmployeeModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model: EmployeeModel = data as EmployeeModel;
    return (
      typeof model.employeeId === "number" &&
      typeof model.username === "string" &&
      typeof model.password === "string" &&
      typeof model.branchId === "number" &&
      typeof model.btMac === "string"
    );
  }

  private static areValidModels(data: unknown[]): data is EmployeeModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
