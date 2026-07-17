import inquirer from 'inquirer';
import chalk from 'chalk';
import { BookRepository } from '../../domain/repositories/book-repository.js';
import { AuthorRepository } from '../../domain/repositories/book-author-repository.js';
import { Book } from '../../domain/entities/book.js';
import { CreateBookUseCase } from '../../application/use-cases/book-cases.js';

export async function bookMenu(
  repo: BookRepository,
  authorRepo: AuthorRepository,
  createBookUseCase: CreateBookUseCase,
) {
  let running = true;

  while (running) {
    const { op } = await inquirer.prompt([
      {
        type: 'select',
        name: 'op',
        message: '--- BIBLIOTECA SYSTEM: Gerenciar Livros ---',
        choices: [
          'Cadastrar livro',
          'Listar livros',
          'Consultar um livro por identificador',
          'Atualizar livro',
          'Deletar livro',
          'Voltar',
        ],
      },
    ]);

    try {
      switch (op) {
        case 'Cadastrar livro':
          const authors = await authorRepo.findAll();
          if (authors.length === 0) {
            console.log(chalk.yellow.bold('⚠️ Cadastre um autor primeiro!'));
            break;
          }

          const data = await inquirer.prompt([
            { type: 'input', name: 'title', message: 'Título do livro:' },
            {
              type: 'select',
              name: 'authorId',
              message: 'Selecione o autor:',
              choices: authors.map((a) => ({ name: a.name, value: a.id })),
            },
            { type: 'number', name: 'qty', message: 'Quantidade disponível:' },
          ]);

          await createBookUseCase.execute({
            title: data.title,
            authorId: data.authorId,
            quantity: data.qty,
          });
          console.log(chalk.green.bold('✔ Livro cadastrado com sucesso!'));
          break;

        case 'Listar livros':
          const list = await repo.findAll();
          if (list.length === 0) {
            console.log(chalk.yellow.bold('⚠️ Nenhum livro cadastrado.'));
          } else {
            console.log(chalk.blue.bold('\n--- Lista de Livros ---'));
            list.forEach((b: any) => {
              console.log(
                `${chalk.yellow(`[ID: ${b.id}]`)} ${b.title} ${chalk.dim(`(Qtd: ${b.availableQuantity})`)}`,
              );
            });
            console.log('------------------------\n');
          }
          break;

        case 'Consultar um livro por identificador':
          const books = await repo.findAll();
          if (books.length === 0) {
            console.log(chalk.yellow.bold('⚠️ Nenhum livro cadastrado.'));
            break;
          }

          const { idConsult } = await inquirer.prompt([
            {
              type: 'select',
              name: 'idConsult',
              message: 'Selecione o livro para consultar:',
              choices: books.map((b) => ({
                name: `${b.title} ${chalk.dim(`(ID: ${b.id})`)}`,
                value: b.id,
              })),
            },
          ]);

          const book = await repo.findById(idConsult);
          if (book) {
            console.log(chalk.blue.bold(`\n--- Detalhes do Livro ---`));
            console.log(`${chalk.bold('ID:')} ${book.id}`);
            console.log(`${chalk.bold('Título:')} ${book.title}`);
            console.log(
              `${chalk.bold('Qtd Disponível:')} ${book.availableQuantity}\n`,
            );
          }
          break;

        case 'Atualizar livro':
          const listUp = await repo.findAll();
          if (listUp.length === 0) {
            console.log(chalk.yellow.bold('⚠️ Nenhum livro para atualizar.'));
            break;
          }

          const { idUp } = await inquirer.prompt([
            {
              type: 'select',
              name: 'idUp',
              message: 'Selecione o livro para atualizar:',
              choices: listUp.map((b) => ({
                name: `${b.title} ${chalk.dim(`(ID: ${b.id})`)}`,
                value: b.id,
              })),
            },
          ]);

          const currentBook = await repo.findById(idUp);
          if (!currentBook) {
            console.log(chalk.red('❌ Livro não encontrado!'));
            break;
          }

          const updateData = await inquirer.prompt([
            {
              type: 'input',
              name: 'title',
              message: 'Novo título:',
              default: currentBook.title,
            },
            {
              type: 'number',
              name: 'qty',
              message: 'Nova quantidade:',
              default: currentBook.availableQuantity,
            },
          ]);

          await repo.update(
            new Book({
              id: idUp,
              title: updateData.title,
              authorId: currentBook.authorId,
              availableQuantity: updateData.qty,
            }),
          );
          console.log(chalk.green.bold('✔ Livro atualizado com sucesso!'));
          break;

        case 'Deletar livro':
          const listDel = await repo.findAll();
          if (listDel.length === 0) {
            console.log(chalk.yellow.bold('⚠️ Nenhum livro para deletar.'));
            break;
          }

          const { idDel } = await inquirer.prompt([
            {
              type: 'select',
              name: 'idDel',
              message: 'Selecione o livro para remover:',
              choices: listDel.map((b) => ({
                name: `${b.title} ${chalk.dim(`(ID: ${b.id})`)}`,
                value: b.id,
              })),
            },
          ]);

          await repo.delete(idDel);
          console.log(chalk.red.bold('✔ Livro removido com sucesso!'));
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
