export type ErrorCause = unknown;

export interface BaseExceptionConstructorOptions {
  code?: string;
  cause?: ErrorCause;
  messagePrefix?: string;
}

export class BaseException extends Error {
  protected code?: string;

  constructor(options?: BaseExceptionConstructorOptions) {
    super();
    this.name = this.constructor.name;
    if (!options) return this;

    this.code = options.code;
    if (options.cause instanceof Error) {
      this.stack = options.cause.stack;
    }

    const prefix = options.messagePrefix ?? '';
    const causeText = options.cause
      ? BaseException.formatCause(options.cause)
      : '';
    this.message = `${prefix}${causeText}`;
  }

  protected static formatCause(cause: ErrorCause): string {
    if (typeof cause === 'string') return cause;
    if (cause instanceof Error) return `${cause.name}: ${cause.message}`;
    try {
      return JSON.stringify(cause, null, 2);
    } catch {
      return 'unidentifiable cause';
    }
  }
}
