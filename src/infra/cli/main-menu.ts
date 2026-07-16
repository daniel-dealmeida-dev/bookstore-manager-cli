import inquirer from 'inquirer';
import { authorMenu } from './author-menu.js';
import { customerMenu } from './customer-menu.js';
import { bookMenu } from './book-menu.js';
import { loanMenu } from './loan-menu.js';
import { returnMenu } from './return-menu.js';
import { reportMenu } from './report-menu.js';

export async function mainMenu(deps: any) {
    let running = true;
    while (running) {
        console.clear();
        const { option } = await inquirer.prompt([{
            type: 'select', 
            name: 'option',
            message: '--- BIBLIOTECA SYSTEM ---',
            choices: [
                'Gerenciar Autores', 
                'Gerenciar Livros', 
                'Gerenciar Clientes', 
                'Gerenciar Relatórios',
                'Realizar Empréstimo', 
                'Registrar Devolução', 
                'Sair'
            ]
        }]);

        switch (option) {
            case 'Gerenciar Autores':
                await authorMenu(deps.authorRepo, deps.createAuthorUseCase);
                break;

            case 'Gerenciar Livros':
                await bookMenu(deps.bookRepo, deps.authorRepo);
                break;

            case 'Gerenciar Clientes':
                await customerMenu(deps.customerRepo, deps.createCustomerUseCase);
                break;

            case 'Realizar Empréstimo':
                await loanMenu(deps.loanRepo, deps.bookRepo, deps.customerRepo);
                break;

            case 'Registrar Devolução':
                await returnMenu(deps.loanRepo);
                break;

            case 'Gerenciar Relatórios':
                await reportMenu(deps.loanRepo);
                break;

            case 'Sair':
                running = false;
                console.log("Encerrando o sistema...");
                break;
        }
    }
}