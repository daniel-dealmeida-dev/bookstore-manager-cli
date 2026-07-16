import { Customer } from '../../domain/entities/customer.js';
import { CustomerRepository } from '../../domain/repositories/customer-repository.js';
import { PgConnection } from './pg-connection.js';
import { Logger } from '../logger/logger.js';

export class PostgresCustomerRepository implements CustomerRepository {
  constructor(private logger: Logger) {}

  async save(customer: Customer): Promise<Customer> {
    const client = await PgConnection.getInstance().connect();
    try {
      const sql =
        'INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING id';
      const res = await client.query(sql, [customer.name, customer.email]);
      return new Customer(res.rows[0].id, customer.name, customer.email);
    } finally {
      client.release();
    }
  }

  async findAll(): Promise<Customer[]> {
    const client = await PgConnection.getInstance().connect();
    try {
      const res = await client.query('SELECT id, name, email FROM customers');
      return res.rows.map((r) => new Customer(r.id, r.name, r.email));
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<Customer | null> {
    const client = await PgConnection.getInstance().connect();
    try {
      const sql = 'SELECT id, name, email FROM customers WHERE id = $1';
      const res = await client.query(sql, [id]);
      if (res.rows.length === 0) return null;
      return new Customer(res.rows[0].id, res.rows[0].name, res.rows[0].email);
    } finally {
      client.release();
    }
  }

  async update(customer: Customer): Promise<void> {
    const client = await PgConnection.getInstance().connect();
    try {
      const sql = 'UPDATE customers SET name = $1, email = $2 WHERE id = $3';
      const res = await client.query(sql, [
        customer.name,
        customer.email,
        customer.id,
      ]);
      if (res.rowCount === 0) throw new Error('Cliente não encontrado.');
    } finally {
      client.release();
    }
  }

  async delete(id: string): Promise<void> {
    const client = await PgConnection.getInstance().connect();
    try {
      await client.query('DELETE FROM customers WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }
}
