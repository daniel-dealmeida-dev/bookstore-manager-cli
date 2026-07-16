import inquirer from "inquirer";
import { CustomerRepository } from "../../domain/repositories/customer-repository.js";
import { CreateCustomerUseCase } from "../../application/use-cases/customer-cases.js"
import { Customer } from "../../domain/entities/customer.js";

export async function customerMenu(repo: CustomerRepository, useCase: CreateCustomerUseCase) {
    let running = true;
    
    while (running) {
        const { op } = await inquirer.prompt([{
            type: 'select',
            name: 'op', 
            message: 'Menu de Clientes:',
            choices: ['Cadastrar', 'Listar', 'Voltar']
        }]);

        switch (op) {
    case 'Cadastrar':
        const { name, email } = await inquirer.prompt([
            { name: 'name', message: 'Nome:' },
            { name: 'email', message: 'E-mail:' }
        ]);
        await useCase.execute(name, email);
        console.log(' Cliente cadastrado!');
        break;

    case 'Listar':
        console.table(await repo.findAll());
        break;

    case 'Atualizar':
        const { idUpdate, newName, newEmail } = await inquirer.prompt([
            { name: 'idUpdate', message: 'ID do cliente para atualizar:' },
            { name: 'newName', message: 'Novo Nome:' },
            { name: 'newEmail', message: 'Novo E-mail:' }
        ]);
        const customerToUpdate = new Customer(idUpdate, newName, newEmail);
        await repo.update(customerToUpdate);
        console.log(' Cliente atualizado!');
        break;

    case 'Deletar':
        const { idDelete } = await inquirer.prompt([
            { name: 'idDelete', message: 'ID do cliente para deletar:' }
        ]);
        const exists = await repo.findById(idDelete);
        if (!exists) {
            console.log(' Cliente não encontrado.');
        } else {
            await repo.delete(idDelete);
            console.log(' Cliente removido!');
        }
        break;

    case 'Sair':
        running = false;
        break;
        }
    }
}