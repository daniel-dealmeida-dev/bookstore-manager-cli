import { PostgresAuthorRepository } from '../infra/database/postgrees-author-repository.js';
import { CreateAuthorUseCase } from '../application/use-cases/create-author-cases.js';
import { ConsoleLogger } from '../infra/logger/console-logger.js';
import { mainMenu } from '../infra/cli/main-menu.js';

async function main() {
    const logger = new ConsoleLogger();
    const authorRepo = new PostgresAuthorRepository(logger); 
    
    const deps = {
        authorRepo: authorRepo,
        createAuthorUseCase: new CreateAuthorUseCase(authorRepo) // Passa a instância existente
    };

    await mainMenu(deps);
}

main().catch(err => console.error(err));