import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config();

export class PgConnection{
    private static instance: Pool;

    private constructor(){}

       static getInstance(): Pool{
        if(!this.instance){
            this.instance = new Pool({
                user: process.env.DB_USER,
                host: process.env.DB_HOST,
                database: process.env.DB_DATABASE,
                password: process.env.DB_PASSWORD,
                port: Number(process.env.DB_PORT),
            });
        }
        return this.instance;
       
    }
}