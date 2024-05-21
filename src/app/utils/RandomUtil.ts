import { IUtil } from "../interfaces/IUtil";

export class RandomUtil implements IUtil {
  public static generateRandomNumberString(length: number): string {
    let result: string = "";
    const characters: string = "0123456789";
    for (let i: number = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }
}
