import { Pool } from "pg";

export class DbConstants {
  public static readonly POOL: Pool = new Pool({
    user: "UGFA",
    host: "localhost",
    database: "DGFA",
    port: 5432,
  });
  public static readonly BEGIN: string = "BEGIN";
  public static readonly COMMIT: string = "COMMIT";
  public static readonly ROLLBACK: string = "ROLLBACK";
}
