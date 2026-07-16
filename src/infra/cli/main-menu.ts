import inquirer from 'inquirer';
import { authorMenu } from './author-menu.js';
import { customerMenu } from './customer-menu.js';
import { bookMenu } from './book-menu.js';

export async function mainMenu(deps: any) {
    let running = true;
    while (running) {
        const { option } = await inquirer.prompt([{
            type: 'select',
            name: 'option',
            message: '--- BIBLIOTECA SYSTEM ---',
            choices: ['Gerenciar Autores', 'Gerenciar Livros', 'Gerenciar Clientes', 'Sair']
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

            case 'Sair':
                running = false;
                console.log("Encerrando o sistema...");
                break;
        }
    }
}