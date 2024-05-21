import { IResponse } from "../../../app/interfaces/IResponse";

export class PairResponse implements IResponse {
  constructor(public readonly success: boolean) {}
}
