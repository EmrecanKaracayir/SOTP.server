import { Pool } from "pg";

export class DbConstants {
  public static readonly POOL: Pool = new Pool({
    user: "UGFA",
    host: "rds-gfa-database.czggso0ksewe.eu-central-1.rds.amazonaws.com",
    database: "DGFA",
    port: 5432,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  public static readonly BEGIN: string = "BEGIN";
  public static readonly COMMIT: string = "COMMIT";
  public static readonly ROLLBACK: string = "ROLLBACK";
}
