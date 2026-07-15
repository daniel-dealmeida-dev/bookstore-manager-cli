import inquirer from 'inquirer';
import { authorMenu } from './author-menu.js';

export async function mainMenu(deps: any) {
    let running = true;
    while (running) {
        const { option } = await inquirer.prompt([{
            type: 'list',
            name: 'option',
            message: '--- BIBLIOTECA SYSTEM ---',
            choices: ['Gerenciar Autores', 'Gerenciar Livros', 'Gerenciar Clientes', 'Sair']
        }]);

        switch (option) {
            case 'Gerenciar Autores': 
                await authorMenu(deps.authorRepo, deps.createAuthorUseCase); 
                break;
            case 'Sair': 
                running = false; 
                break;
        }
    }
}