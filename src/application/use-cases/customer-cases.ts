import { Customer } from '../../domain/entities/customer.js';
import { CustomerRepository } from '../../domain/repositories/customer-repository.js';

export class CreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(name: string, email: string): Promise<Customer> {
    if (!name || name.trim() === '') {
      throw new Error('O nome do cliente é obrigatório.');
    }
    if (!email || email.trim() === '') {
      throw new Error('O email do cliente é obrigatório.');
    }

    const customer = new Customer(null, name, email);

    return await this.customerRepository.save(customer);
  }
}
