import { Customer } from '../../domain/entities/customer.js';
import { CustomerRepository } from '../../domain/repositories/customer-repository.js';
import { CreateCustomerDTO } from '../../domain/dto/system-dto.js';
export class CreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(data: CreateCustomerDTO): Promise<Customer> {
    const customer = new Customer({
      id: null,
      name: data.name,
      email: data.email,
    });

    return await this.customerRepository.save(customer);
  }
}