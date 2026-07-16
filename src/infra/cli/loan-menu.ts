import inquirer from "inquirer";
import chalk from "chalk";

export async function loanMenu(loanRepo: any, bookRepo: any, customerRepo: any) {
    const books = await bookRepo.findAll();
    const availableBooks = books.filter((b: any) => b.available_quantity > 0);
    const customers = await customerRepo.findAll();

    if (availableBooks.length === 0) {
        console.log(chalk.yellow('Nenhum livro disponível para empréstimo no momento.'));
        return;
    }

   const { bookId, customerId } = await inquirer.prompt([
        {
            type: 'select', 
            name: 'bookId',
            message: 'Selecione o livro:',
            choices: availableBooks.map((b: any) => ({ name: b.title, value: b.id }))
        },
        {
            type: 'select', 
            name: 'customerId',
            message: 'Selecione o cliente:',
            choices: customers.map((c: any) => ({ name: c.name, value: c.id }))
        }
    ]);

    try {
        await loanRepo.createLoan(bookId, customerId);
        console.log(chalk.green.bold('Empréstimo registrado com sucesso!'));
    } catch (error) {
        console.error(chalk.red('Erro ao registrar empréstimo:'), error);
    }
}