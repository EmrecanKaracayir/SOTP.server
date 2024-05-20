import { IResponse } from "../../../app/interfaces/IResponse";

export class LogetResponse implements IResponse {
  constructor(public readonly documents: string[]) {}
}
