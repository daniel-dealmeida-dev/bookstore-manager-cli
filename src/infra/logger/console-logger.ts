import { Logger } from "./logger";

export class ConsoleLogger implements Logger{
    info(message: string): void{
        console.log(`[INFO] ${new Date().toString()} - ${message}`);
    }
    error(message: string, error?: any): void{
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
    }

    warn(message: string): void{
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
    }
}