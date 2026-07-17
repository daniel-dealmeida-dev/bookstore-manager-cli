import {
  BaseException,
  BaseExceptionConstructorOptions,
} from './base-exception.js';

export class SystemException extends BaseException {
  constructor(options: BaseExceptionConstructorOptions) {
    super(options);
  }

  static fromUnknown(cause: unknown, code?: string) {
    return new SystemException({
      code,
      cause,
      messagePrefix: 'Erro crítico no sistema: ',
    });
  }
}
