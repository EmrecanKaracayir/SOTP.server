import { IResponse } from "../../../app/interfaces/IResponse";

export class DecryptResponse implements IResponse {
  constructor(public readonly documentContent: string) {}
}
