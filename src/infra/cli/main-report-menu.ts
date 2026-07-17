import inquirer from 'inquirer';
import { loanReportsMenu } from './reports/loan-reports-menu.js';
import { libraryReportsMenu } from './reports/library-reports-menu.js';

export async function reportMenu(loanRepo: any) {
  let viewing = true;
  while (viewing) {
    const { category } = await inquirer.prompt([
      {
        type: 'select',
        name: 'category',
        message: 'Escolha a categoria de relatório:',
        choices: [
          'Relatórios de Empréstimos',
          'Relatórios de Acervo',
          'Voltar'
        ],
      },
    ]);

    if (category === 'Relatórios de Empréstimos') {
      await loanReportsMenu(loanRepo);
    } else if (category === 'Relatórios de Acervo') {
      await libraryReportsMenu(loanRepo);
    } else {
      viewing = false;
    }
  }
}