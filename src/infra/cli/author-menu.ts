import inquirer from 'inquirer';
import chalk from 'chalk';
import { AuthorRepository } from '../../domain/repositories/book-author-repository.js';
import { CreateAuthorUseCase } from '../../application/use-cases/create-author-cases.js';
import { Author } from '../../domain/entities/book-author.js';

export async function authorMenu(
  repo: AuthorRepository,
  createUseCase: CreateAuthorUseCase,
) {
  let running = true;

  while (running) {
    const { op } = await inquirer.prompt([
      {
        type: 'select',
        name: 'op',
        message: '--- BIBLIOTECA SYSTEM: Gerenciar Autores ---',
        choices: [
          'Cadastrar autores',
          'Listar autores',
          'consultar um autor por identificador',
          'Atualizar autores',
          'Deletar autores',
          'Voltar',
        ],
      },
    ]);

    try {
      switch (op) {
       case 'Cadastrar autores':
          const answers = await inquirer.prompt([
            { type: 'input', name: 'name', message: 'Nome do Autor:' },
            { type: 'input', name: 'nationality', message: 'Nacionalidade:' },
            { type: 'input', name: 'description', message: 'Descrição do autor:' },
          ]);

          await createUseCase.execute({
            id: null, 
            name: answers.name,
            nationality: answers.nationality,
            description: answers.description,
          });
          
          console.log(chalk.green.bold('✔ Autor salvo com sucesso!'));
          break;

        case 'Listar autores':
          const list = await repo.findAll();
          if (list.length === 0) {
            console.log(chalk.yellow.bold('⚠️ Nenhum autor cadastrado.'));
          } else {
            console.log(chalk.blue.bold('\n--- Lista de Autores ---'));
            list.forEach((a) => {
              console.log(
                `${chalk.yellow(`[ID: ${a.id}]`)} ${a.name} ${chalk.dim(`(${a.nationality})`)}`,
              );
            });
            console.log('------------------------\n');
          }
          break;

        case 'consultar um autor por identificador':
          const autores = await repo.findAll();
          if (autores.length === 0) {
            console.log(chalk.yellow.bold('⚠️ Nenhum autor cadastrado.'));
            break;
          }

          const { idConsult } = await inquirer.prompt([
            {
              type: 'select',
              name: 'idConsult',
              message: 'Selecione o ID do autor para consultar:',
              choices: autores.map((a) => ({
                name: `ID: ${a.id} - ${a.name}`,
                value: a.id,
              })),
            },
          ]);

          const author = await (repo as any).findByIdWithBooks(idConsult);

          if (author) {
            console.log(chalk.blue.bold(`\n--- Detalhes do Autor ---`));
            console.log(`${chalk.bold('ID:')} ${author.id}`);
            console.log(`${chalk.bold('Nome:')} ${author.name}`);
            console.log(
              `${chalk.bold('Nacionalidade:')} ${author.nationality}`,
            );
            console.log(
              `${chalk.bold('Descrição:')} ${author.description || 'Nenhuma descrição cadastrada'}`,
            );
            console.log(
              `${chalk.bold('Livros:')} ${author.books?.length > 0 ? author.books.map((b: any) => b.title).join(', ') : 'Nenhum'}\n`,
            );
          } else {
            console.log(chalk.red('❌ Autor não encontrado.'));
          }
          break;

        case 'Atualizar autores':
          const autoresUp = await repo.findAll();
          if (autoresUp.length === 0) {
            console.log(chalk.yellow.bold('⚠️ Nenhum autor para atualizar.'));
            break;
          }

          const { idUp } = await inquirer.prompt([
            {
              type: 'select',
              name: 'idUp',
              message: 'Selecione o autor para atualizar:',
              choices: autoresUp.map((a) => ({ name: a.name, value: a.id })),
            },
          ]);

          const currentAuthor = await repo.findById(idUp);
          if (!currentAuthor) {
            console.log(chalk.red('❌ Autor não encontrado!'));
            break;
          }

          const updateData = await inquirer.prompt([
            {
              type: 'input',
              name: 'name',
              message: 'Novo nome:',
              default: currentAuthor.name,
            },
            {
              type: 'input',
              name: 'nationality',
              message: 'Nova nacionalidade:',
              default: currentAuthor.nationality,
            },
            {
              type: 'input',
              name: 'description',
              message: 'Nova descrição:',
              default: currentAuthor.description,
            },
          ]);

          await repo.update(
            new Author({
              id: Number(idUp),
              name: updateData.name,
              nationality: updateData.nationality,
              description: updateData.description,
            }),
          );
          console.log(chalk.green.bold('✔ Autor atualizado com sucesso!'));
          break;

        case 'Deletar autores':
          const autoresDel = await repo.findAll();
          if (autoresDel.length === 0) {
            console.log(chalk.yellow.bold('⚠️ Nenhum autor para deletar.'));
            break;
          }

          const { idDel } = await inquirer.prompt([
            {
              type: 'select',
              name: 'idDel',
              message: 'Selecione o autor para deletar:',
              choices: autoresDel.map((a) => ({ name: a.name, value: a.id })),
            },
          ]);

          await repo.delete(idDel);
          console.log(chalk.red.bold('✔ Autor removido com sucesso!'));
          break;

        case 'Voltar':
          running = false;
          break;
      }
    } catch (err: any) {
      console.error(chalk.red(`❌ Erro: ${err.message}`));
    }
  }
}
