import { PostgresAuthorRepository } from '../infra/database/postgrees-author-repository.js';
import { CreateAuthorUseCase } from '../application/use-cases/create-author-cases.js';
import { ConsoleLogger } from '../infra/logger/console-logger.js';
import { mainMenu } from '../infra/cli/main-menu.js';
import { PostgresCustomerRepository } from '../infra/database/postgres-customer-repository.js';
import { CreateCustomerUseCase } from '../application/use-cases/customer-cases.js';
import { PostgresBookRepository } from '../infra/database/postgres-book-repository.js';
import { CreateBookUseCases } from '../application/use-cases/book-cases.js';
import { PgConnection } from '../infra/database/pg-connection.js'; 
import { PostgresLoanRepository } from '../infra/database/postgres-loan-repository.js';
import { loanMenu } from '../infra/cli/loan-menu.js';
import { returnMenu } from '../infra/cli/return-menu.js';


async function main() {
    const logger = new ConsoleLogger();
    const authorRepo = new PostgresAuthorRepository(logger);
    const customerRepo = new PostgresCustomerRepository(logger); 
    const bookRepo = new PostgresBookRepository(logger);
    const loanRepo = new PostgresLoanRepository();

    const deps = {
       authorRepo: new PostgresAuthorRepository(logger),
        createAuthorUseCase: new CreateAuthorUseCase(authorRepo),
        customerRepo: new PostgresCustomerRepository(logger),
        createCustomerUseCase: new CreateCustomerUseCase(customerRepo),
        bookRepo: new PostgresBookRepository(logger),
        createBookUseCase: new CreateBookUseCases(bookRepo),
        loanRepo: loanRepo,
    
    }; 
    await mainMenu(deps);
}
main();