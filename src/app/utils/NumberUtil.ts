import { IUtil } from "../interfaces/IUtil";

export class NumberUtil implements IUtil {
  public static isBetween(
    val: number,
    bound1: number,
    bound2: number,
  ): boolean {
    return val >= Math.min(bound1, bound2) && val <= Math.max(bound1, bound2);
  }
}
