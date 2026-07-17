import chalk from 'chalk';
import inquirer from 'inquirer';

export async function returnMenu(loanRepo: any) {
  const activeLoans = await loanRepo.findActiveLoans();

  if (!activeLoans || activeLoans.length === 0) {
    console.log(chalk.yellow('⚠️ Nenhum empréstimo ativo para devolução.'));
    return;
  }

  const { selectedLoan } = await inquirer.prompt([
    {
      type: 'select',
      name: 'selectedLoan',
      message: 'Selecione o empréstimo para devolver:',
      choices: activeLoans.map((l: any) => {
        return {
          name: `${l.book_title || 'Livro Sem Título'} - Cliente: ${l.customer_name || 'Cliente Sem Nome'}`,
          value: { loanId: l.id, bookId: l.book_id },
        };
      }),
    },
  ]);

  try {
    await loanRepo.returnBook({
      loanId: selectedLoan.loanId,
      bookId: selectedLoan.bookId,
    });

    console.log(chalk.green.bold('✔ Devolução realizada com sucesso!'));
  } catch (error) {
    console.error(chalk.red('Erro ao realizar devolução:'), error);
  }
}
