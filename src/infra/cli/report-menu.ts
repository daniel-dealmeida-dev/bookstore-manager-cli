import inquirer from 'inquirer';
import chalk from 'chalk';

export async function reportMenu(loanRepo: any) {
    let viewing = true;
    while (viewing) {
        const { reportType } = await inquirer.prompt([{
            type: 'select',
            name: 'reportType',
            message: 'Escolha o relatório:',
            choices: ['Empréstimos Ativos', 'Livros Mais Populares', 'Voltar']
        }]);

        if (reportType === 'Voltar') {
            viewing = false;
            break; 
        }

        try {
            let data: any[] = [];
            if (reportType === 'Empréstimos Ativos') {
                data = await loanRepo.getActiveLoansReport();
            } else if (reportType === 'Livros Mais Populares') {
                data = await loanRepo.getPopularBooksReport();
            }

            if (!data || data.length === 0) {
                console.log(chalk.yellow('\n⚠️ Nenhum dado encontrado no banco de dados.'));
            } else {
                console.log(`\n--- Relatório: ${reportType} ---`);
                console.table(data);
            }
        } catch (error) {
            console.error(chalk.red('Erro ao buscar relatório:'), error);
        }

        await inquirer.prompt([{ type: 'input', name: 'wait', message: 'Pressione ENTER para voltar ao menu de relatórios...' }]);
    }
}