import chalk from "chalk";
import inquirer from "inquirer";

export async function returnMenu(loanRepo: any) {
    const activeLoans = await loanRepo.findActiveLoans();

    if (activeLoans.length === 0) { 
        console.log(chalk.yellow('⚠️ Nenhum empréstimo ativo para devolução.'));
        return;
    }

    const { selectedLoan } = await inquirer.prompt([
        {
            type: 'list', 
            name: 'selectedLoan', 
            message: 'Selecione o empréstimo para devolver:',
            choices: activeLoans.map((l: any) => ({
                name: `${l.book_title} - Cliente: ${l.customer_name}`,
                value: { loanId: l.id, bookId: l.book_id } 
            }))
        }
    ]);

    await loanRepo.returnBook(selectedLoan.loanId, selectedLoan.bookId);
    
    console.log(chalk.green.bold("✔ Devolução realizada com sucesso!"));
}