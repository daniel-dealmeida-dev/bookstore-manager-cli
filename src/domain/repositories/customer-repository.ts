import { Customer } from '../entities/customer.js';

export interface CustomerRepository {
  save(customer: Customer): Promise<Customer>;
  findAll(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
  update(customer: Customer): Promise<void>;
  delete(id: string): Promise<void>;
}
