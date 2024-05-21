import { IResponse } from "../../../app/interfaces/IResponse";

export class LoginResponse implements IResponse {
  constructor(
    public readonly accountId: number,
    public readonly sharedOtp: string,
    public readonly pairDoc: PairDocData | null,
  ) {}
}

export class PairDocData implements IResponse {
  constructor(
    public readonly pairUsername: string,
    public readonly documentId: number,
    public readonly content: string,
  ) {}
}
