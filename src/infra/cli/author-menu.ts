import inquirer from 'inquirer';
import { AuthorRepository } from '../../domain/repositories/book-author-repository.js';
import { CreateAuthorUseCase } from '../../application/use-cases/create-author-cases.js';

export async function authorMenu(repo: AuthorRepository, createUseCase: CreateAuthorUseCase) {
    const { op } = await inquirer.prompt([{
        type: 'list',
        name: 'op',
        message: 'Menu de Autores:',
        choices: ['Cadastrar', 'Listar', 'Voltar']
    }]);

    if (op === 'Cadastrar') {
        const answers = await inquirer.prompt([
            { name: 'name', message: 'Nome:' },
            { name: 'nationality', message: 'Nacionalidade:' }
        ]);
        await createUseCase.execute(null, answers.name, answers.nationality);
        console.log(' Autor salvo!');
    } else if (op === 'Listar') {
        const list = await repo.findAll();
        console.table(list);
    }
}