import inquirer from 'inquirer';
import chalk from 'chalk';
import { LoanRepository } from '../../domain/repositories/loan-repository.js';
import { BookRepository } from '../../domain/repositories/book-repository.js';
import { CustomerRepository } from '../../domain/repositories/customer-repository.js';

export async function loanMenu(loanRepo: LoanRepository, bookRepo: BookRepository , customerRepo: CustomerRepository ) {
    const books = await bookRepo.findAll();
    const availableBooks = books.filter((b: any) => b.availableQuantity > 0);
    
    if (!availableBooks || availableBooks.length === 0) {
        console.log(chalk.yellow('⚠️ Nenhum livro disponível com estoque > 0.'));
        return; 
    }

    const customers = await customerRepo.findAll();
    
    if (customers.length === 0) {
        console.log(chalk.yellow('⚠️ Nenhum cliente cadastrado.'));
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
        await loanRepo.createLoan({ bookId, customerId });
        console.log(chalk.green.bold('✔ Empréstimo registrado com sucesso!'));
    } catch (error) {
        console.error(chalk.red('❌ Erro ao registrar empréstimo:'), error);
    }
}