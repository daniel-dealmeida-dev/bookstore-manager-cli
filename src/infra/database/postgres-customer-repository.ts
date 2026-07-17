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
      return new Customer({
        id: res.rows[0].id,
        name: customer.name,
        email: customer.email,
      });
    } finally {
      client.release();
    }
  }

  async findAll(): Promise<Customer[]> {
    const client = await PgConnection.getInstance().connect();
    try {
      const res = await client.query('SELECT id, name, email FROM customers WHERE is_active = true');
      return res.rows.map(
        (r) => new Customer({ id: r.id, name: r.name, email: r.email }),
      );
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<Customer | null> {
    const client = await PgConnection.getInstance().connect();
    try {
      const res = await client.query(
        'SELECT id, name, email FROM customers WHERE id = $1 AND is_active = true',
        [id],
      );
      if (res.rows.length === 0) return null;
      return new Customer({
        id: res.rows[0].id,
        name: res.rows[0].name,
        email: res.rows[0].email,
      });
    } finally {
      client.release();
    }
  }

  async update(customer: Customer): Promise<void> {
    const client = await PgConnection.getInstance().connect();
    try {
      const sql = 'UPDATE customers SET name = $1, email = $2 WHERE id = $3';
      await client.query(sql, [customer.name, customer.email, customer.id]);
    } finally {
      client.release();
    }
  }

  async delete(id: string): Promise<void> {
    const client = await PgConnection.getInstance().connect();
    try {
      await client.query('UPDATE customers SET is_active = false WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }
}