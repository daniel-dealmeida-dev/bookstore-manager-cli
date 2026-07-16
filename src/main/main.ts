import { PostgresAuthorRepository } from '../infra/database/postgrees-author-repository.js';
import { CreateAuthorUseCase } from '../application/use-cases/create-author-cases.js';
import { ConsoleLogger } from '../infra/logger/console-logger.js';
import { mainMenu } from '../infra/cli/main-menu.js';
import { PostgresCustomerRepository } from '../infra/database/postgres-customer-repository.js';
import { CreateCustomerUseCase } from '../application/use-cases/customer-cases.js';

async function main() {
    const logger = new ConsoleLogger();
    const authorRepo = new PostgresAuthorRepository(logger);
    const customerRepo = new PostgresCustomerRepository(logger); 

    const deps = {
        authorRepo: authorRepo,
        createAuthorUseCase: new CreateAuthorUseCase(authorRepo),
        customerRepo: new PostgresCustomerRepository(logger),
        createCustomerUseCase: new CreateCustomerUseCase(new PostgresCustomerRepository(logger))
    }; 
    await mainMenu(deps);
}
main();