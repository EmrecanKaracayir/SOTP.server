import { IUtil } from "../interfaces/IUtil";

export class ArrayUtil implements IUtil {
  public static hasAtLeastXCommonElements<T>(
    arr1: T[],
    arr2: T[],
    x: number,
  ): boolean {
    // Filter arr1 to get elements that also appear in arr2
    const commonElements: T[] = arr1.filter((element: T): boolean =>
      arr2.includes(element),
    );
    // Check if there are at least two common elements
    return commonElements.length >= x;
  }
}
