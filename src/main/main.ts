import { PostgresAuthorRepository } from '../infra/database/postgres-author-repository.js';
import { CreateAuthorUseCase } from '../application/use-cases/create-author-cases.js';
import { ConsoleLogger } from '../infra/logger/console-logger.js';
import { mainMenu } from '../infra/cli/main-menu.js';
import { PostgresCustomerRepository } from '../infra/database/postgres-customer-repository.js';
import { CreateCustomerUseCase } from '../application/use-cases/customer-cases.js';
import { PostgresBookRepository } from '../infra/database/postgres-book-repository.js';
import { CreateBookUseCase } from '../application/use-cases/book-cases.js';
import { PgConnection } from '../infra/database/pg-connection.js';
import { PostgresLoanRepository } from '../infra/database/postgres-loan-repository.js';
import { DomainException, SystemException } from '../domain/errors/index.js';

process.on('uncaughtException', (err) => {
  console.error('Erro não tratado (Exception):', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Promise rejeitado não tratado:', reason);
  process.exit(1);
});

async function main() {
  const logger = new ConsoleLogger();

  const authorRepo = new PostgresAuthorRepository(logger);
  const customerRepo = new PostgresCustomerRepository(logger);
  const bookRepo = new PostgresBookRepository(logger);
  const loanRepo = new PostgresLoanRepository();

  const deps = {
    authorRepo,
    createAuthorUseCase: new CreateAuthorUseCase(authorRepo),
    customerRepo,
    createCustomerUseCase: new CreateCustomerUseCase(customerRepo),
    bookRepo,
    createBookUseCase: new CreateBookUseCase(bookRepo),
    loanRepo,
  };

  try {
    await mainMenu(deps);
  } catch (error) {
    if (error instanceof DomainException) {
      console.log(`\n  Aviso: ${error.message}`);
    } else if (error instanceof SystemException) {
      logger.error('CRASH FATAL NO SISTEMA:', error);
      console.log('\n❌ Ocorreu um erro crítico no sistema.');
      process.exit(1);
    } else {
      logger.error('ERRO DESCONHECIDO:', error);
      process.exit(1);
    }
  } finally {
    await PgConnection.getInstance().end();
  }
}

main();
