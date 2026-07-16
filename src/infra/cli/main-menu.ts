import inquirer from 'inquirer';
import { authorMenu } from './author-menu.js';
import { customerMenu } from './customer-menu.js';

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
                console.log("Módulo de Livros em breve...");
                break;

            case 'Gerenciar Clientes':
                console.log("Módulo de Clientes em breve...");
                break;

            case 'Sair':
                running = false;
                console.log("Encerrando o sistema...");
                break;
        }
    }
}