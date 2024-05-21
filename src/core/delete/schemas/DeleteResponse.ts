import { IResponse } from "../../../app/interfaces/IResponse";

export class DeleteResponse implements IResponse {
  constructor(public readonly success: boolean) {}
}
