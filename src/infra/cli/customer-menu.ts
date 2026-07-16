import inquirer from 'inquirer';
import chalk from 'chalk';
import { CustomerRepository } from '../../domain/repositories/customer-repository.js';
import { CreateCustomerUseCase } from '../../application/use-cases/customer-cases.js';
import { Customer } from '../../domain/entities/customer.js';

export async function customerMenu(repo: CustomerRepository, useCase: CreateCustomerUseCase) {
  let running = true;

  while (running) {
    const { op } = await inquirer.prompt([{
      type: 'select',
      name: 'op',
      message: '--- BIBLIOTECA SYSTEM: Gerenciar Clientes ---',
      choices: [
        'Cadastrar clientes',
        'Listar clientes',
        'Consultar um cliente por identificador',
        'Atualizar clientes',
        'Deletar clientes',
        'Voltar'
      ],
    }]);

    try {
      switch (op) {
        case 'Cadastrar clientes':
          const data = await inquirer.prompt([
            { type: 'input', name: 'name', message: 'Nome do Cliente:' },
            { type: 'input', name: 'email', message: 'E-mail:' },
          ]);
          await useCase.execute(data.name, data.email);
          console.log(chalk.green.bold('✔ Cliente salvo com sucesso!'));
          break;

        case 'Listar clientes':
          const list = await repo.findAll();
          if (list.length === 0) {
            console.log(chalk.yellow.bold('⚠️ Nenhum cliente cadastrado.'));
          } else {
            console.log(chalk.blue.bold('\n--- Lista de Clientes ---'));
            list.forEach((c) => {
              console.log(`${chalk.yellow(`[ID: ${c.id}]`)} ${c.name} ${chalk.dim(`(${c.email})`)}`);
            });
            console.log('------------------------\n');
          }
          break;

        case 'Consultar um cliente por identificador':
          const customers = await repo.findAll();
          if (customers.length === 0) {
            console.log(chalk.yellow.bold('⚠️ Nenhum cliente cadastrado.'));
            break;
          }

          const { idConsult } = await inquirer.prompt([{
            type: 'select',
            name: 'idConsult',
            message: 'Selecione o cliente para consultar:',
            choices: customers.map((c) => ({ 
              name: `ID: ${c.id}`, 
              value: c.id 
            })),
          }]);

          const customer = await repo.findById(idConsult);
          if (customer) {
            console.log(chalk.blue.bold(`\n--- Detalhes do Cliente ---`));
            console.log(`${chalk.bold('ID:')} ${customer.id}`);
            console.log(`${chalk.bold('Nome:')} ${customer.name}`);
            console.log(`${chalk.bold('E-mail:')} ${customer.email}\n`);
          }
          break;

        case 'Atualizar clientes':
          const listUp = await repo.findAll();
          if (listUp.length === 0) {
            console.log(chalk.yellow.bold('⚠️ Nenhum cliente para atualizar.'));
            break;
          }

          const { idUp } = await inquirer.prompt([{
            type: 'select',
            name: 'idUp',
            message: 'Selecione o cliente para atualizar:',
            choices: listUp.map((c) => ({ 
              name: `${c.name} ${chalk.dim(`(ID: ${c.id})`)}`, 
              value: c.id 
            })),
          }]);

          const updateData = await inquirer.prompt([
            { type: 'input', name: 'name', message: 'Novo nome:' },
            { type: 'input', name: 'email', message: 'Novo e-mail:' },
          ]);

          await repo.update(new Customer(idUp, updateData.name, updateData.email));
          console.log(chalk.green.bold('✔ Cliente atualizado com sucesso!'));
          break;

        case 'Deletar clientes':
          const listDel = await repo.findAll();
          if (listDel.length === 0) {
            console.log(chalk.yellow.bold('⚠️ Nenhum cliente para deletar.'));
            break;
          }

          const { idDel } = await inquirer.prompt([{
            type: 'select',
            name: 'idDel',
            message: 'Selecione o cliente para remover:',
            choices: listDel.map((c) => ({ 
              name: `${c.name} ${chalk.dim(`(ID: ${c.id})`)}`, 
              value: c.id 
            })),
          }]);

          await repo.delete(idDel);
          console.log(chalk.red.bold('✔ Cliente removido com sucesso!'));
          break;

        case 'Voltar':
          running = false;
          break;
      }
    } catch (err: any) {
      console.error(chalk.red(`❌ Erro: ${err.message}`));
    }
  }
}