import { PostgresAuthorRepository } from '../infra/database/postgrees-author-repository.js';
import { CreateAuthorUseCase } from '../application/use-cases/create-author-cases.js';
import { ConsoleLogger } from '../infra/logger/console-logger.js';
import { mainMenu } from '../infra/cli/main-menu.js';
import { PostgresCustomerRepository } from '../infra/database/postgres-customer-repository.js';
import { CreateCustomerUseCase } from '../application/use-cases/customer-cases.js';
import { PostgresBookRepository } from '../infra/database/postgres-book-repository.js';
import { CreateBookUseCases } from '../application/use-cases/book-cases.js';
import { PgConnection } from '../infra/database/pg-connection.js'; 

async function main() {
    const logger = new ConsoleLogger();
    const authorRepo = new PostgresAuthorRepository(logger);
    const customerRepo = new PostgresCustomerRepository(logger); 
    const bookRepo = new PostgresBookRepository(logger);

    const deps = {
        authorRepo: authorRepo,
        createAuthorUseCase: new CreateAuthorUseCase(authorRepo),

        customerRepo: customerRepo,
        createCustomerUseCase: new CreateCustomerUseCase(customerRepo),

        bookRepo: bookRepo,
        createBookUseCase: new CreateBookUseCases(bookRepo),   
     }; 
    await mainMenu(deps);
}
main();