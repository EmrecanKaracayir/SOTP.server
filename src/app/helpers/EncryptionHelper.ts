import crypto from "crypto";
import { split, combine } from "shamir-secret-sharing";
import type { IHelper } from "../interfaces/IHelper";

export class EncryptionHelper implements IHelper {
  public static generateKey(): Buffer {
    return crypto.randomBytes(32); // 256 bits
  }

  public static encrypt(plainText: string, key: Buffer): string {
    // IV will be 0s, but it's okay since we're using a new key for each encryption
    const iv: Buffer = Buffer.alloc(16, 0); // 128 bits
    const cipher: crypto.Cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted: string = cipher.update(plainText, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  }

  public static decrypt(cipherText: string, key: Buffer): string {
    // IV was 0s, but it's okay since we're using a new key for each encryption
    const iv: Buffer = Buffer.alloc(16, 0); // 128 bits
    const decipher: crypto.Decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      key,
      iv,
    );
    let decrypted: string = decipher.update(cipherText, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  public static async splitKey(key: Buffer): Promise<[Buffer, Buffer]> {
    const secret: Uint8Array = Uint8Array.from(key);
    const shares: Uint8Array[] = await split(secret, 2, 2);
    if (!shares[0] || !shares[1]) {
      throw new Error("Failed to split secret!");
    }
    return [Buffer.from(shares[0]), Buffer.from(shares[1])];
  }

  public static async combineKeySegments(
    share1: Buffer,
    share2: Buffer,
  ): Promise<Buffer> {
    const secret: Uint8Array = await combine([
      Uint8Array.from(share1),
      Uint8Array.from(share2),
    ]);
    return Buffer.from(secret);
  }
}
