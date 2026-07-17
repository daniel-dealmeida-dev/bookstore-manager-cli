import inquirer from 'inquirer';
import chalk from 'chalk';

export async function loanReportsMenu(loanRepo: any) {
  const { reportType } = await inquirer.prompt([
    {
      type: 'select',
      name: 'reportType',
      message: 'Escolha o relatório de empréstimos:',
      choices: [
        'Empréstimos Ativos',
        'Livros Mais Populares',
        'Clientes com Empréstimos Ativos',

        'Histórico de Empréstimos do Cliente',

        'Voltar',
      ],
    },
  ]);

  if (reportType === 'Voltar') return;

  try {
    let data: any[] = [];
    if (reportType === 'Empréstimos Ativos') {
      data = await loanRepo.getActiveLoansReport();
    } else if (reportType === 'Livros Mais Populares') {
      data = await loanRepo.getPopularBooksReport();
    } else if (reportType === 'Clientes com Empréstimos Ativos') {
      data = await loanRepo.getActiveBorrowersReport();
    } else if (reportType === 'Histórico de Empréstimos do Cliente') {
      const { customerId } = await inquirer.prompt([
        { type: 'input', name: 'customerId', message: 'ID do Cliente:' },
      ]);
      data = await loanRepo.getClientHistoryReport(Number(customerId));
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
