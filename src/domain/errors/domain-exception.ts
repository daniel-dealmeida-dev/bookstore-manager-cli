// src/domain/errors/domain.exception.ts
import { BaseException, BaseExceptionConstructorOptions } from './base-exception.js';

export class DomainException extends BaseException {
  constructor(message: string, options?: BaseExceptionConstructorOptions) {
    super({
      ...options,
      messagePrefix: message,
    });
  }
}