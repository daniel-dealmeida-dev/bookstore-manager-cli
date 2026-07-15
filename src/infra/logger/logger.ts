export interface Logger {
  info(message: string): void;
  error(message: string, error?: any): void;
  warn(message: string): void;
}