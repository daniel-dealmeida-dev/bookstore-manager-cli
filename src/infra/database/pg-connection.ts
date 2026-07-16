import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class PgConnection {
  private static instance: Pool;

  private constructor() {}

  static getInstance(): Pool {
    if (!this.instance) {
      this.instance = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || '5432'),
      });
    }
    return this.instance;
  }
}
