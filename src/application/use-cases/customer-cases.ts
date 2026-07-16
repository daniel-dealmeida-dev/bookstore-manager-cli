import { Customer } from "../../domain/entities/customer.js";
import { CustomerRepository } from "../../domain/repositories/customer-repository.js";

export class CreateCustomerUseCase {
    constructor(private repo: CustomerRepository) {}

    async execute(name: string, email: string): Promise<Customer> {
        const allCustomers = await this.repo.findAll();
        const emailExists = allCustomers.find(c => c.email === email);
        
        if (emailExists) {
            throw new Error(`O e-mail ${email} já está cadastrado.`);
        }

        const customer = new Customer(null, name, email);

        return await this.repo.save(customer);
    }
}