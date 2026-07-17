import inquirer from 'inquirer';
import chalk from 'chalk';

export async function libraryReportsMenu(loanRepo: any) {
  const { reportType } = await inquirer.prompt([
    {
      type: 'select',
      name: 'reportType',
      message: 'Escolha o relatório de acervo:',
      choices: [
        'Livros Disponíveis',

        'Livros por Autor',

        'Autores com mais livros na biblioteca',

        'Livros nunca emprestados',

        'Voltar',
      ],
    },
  ]);

  if (reportType === 'Voltar') return;

  try {
    let data: any[] = [];
    if (reportType === 'Livros Disponíveis') {
      data = await loanRepo.getAvailableBooksReport();
    } else if (reportType === 'Livros por Autor') {
      data = await loanRepo.getBooksByAuthorReport();
    } else if (reportType === 'Autores com mais livros na biblioteca') {
      data = await loanRepo.getAuthorsWithMostBooksReport();
    } else if (reportType === 'Livros nunca emprestados') {
      data = await loanRepo.getNeverBorrowedBooksReport();
    }

    if (data.length === 0)
      console.log(chalk.yellow('\n⚠️ Nenhum dado encontrado.'));
    else console.table(data);
  } catch (error) {
    console.error(chalk.red('Erro:'), error);
  }
  await inquirer.prompt([
    { type: 'input', name: 'wait', message: 'Pressione ENTER...' },
  ]);
}
