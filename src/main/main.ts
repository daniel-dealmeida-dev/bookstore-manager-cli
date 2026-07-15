import { PostgresAuthorRepository } from '../infra/database/postgrees-author-repository';
import { CreateAuthorUseCase } from '../application/use-cases/create-author-cases';
import { ConsoleLogger } from '../infra/logger/console-logger';

async function main() {
  const logger = new ConsoleLogger();
  const repository = new PostgresAuthorRepository(logger);
  const createAuthor = new CreateAuthorUseCase(repository);

  try {
    const author = await createAuthor.execute(
      '1',
      'Machado de assis',
      'Brasileiro',
    );
    console.log('Sucesso:', author);
  } catch (error: any) {
    console.error('Erro:', error.message);
  }
}

main();
