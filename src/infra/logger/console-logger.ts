import chalk from 'chalk';
import { Logger } from './logger.js';

export class ConsoleLogger implements Logger {
  info(message: string): void {
    console.log(
      `${chalk.cyan('[INFO]')} ${new Date().toString()} - ${message}`,
    );
  }

  error(message: string, error?: any): void {
    console.error(
      `${chalk.red('[ERROR]')} ${new Date().toISOString()} - ${message}`,
      error || '',
    );
  }

  warn(message: string): void {
    console.warn(
      `${chalk.yellow('[WARN]')} ${new Date().toISOString()} - ${message}`,
    );
  }
}
