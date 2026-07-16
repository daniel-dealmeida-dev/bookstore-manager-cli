import { PgConnection } from './pg-connection.js';

export class PostgresLoanRepository {
  async createLoan(bookId: number, customerId: number): Promise<void> {
    const client = await PgConnection.getInstance().connect();

    try {
      await client.query('BEGIN');

      await client.query(
        'UPDATE books SET available_quantity = available_quantity - 1 WHERE id = $1 AND available_quantity > 0',
        [bookId]
      );

      await client.query(
        'INSERT INTO loans (book_id, customer_id) VALUES ($1, $2)',
        [bookId, customerId]
      );

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async returnBook(loanId: number, bookId: number): Promise<void> {
    const client = await PgConnection.getInstance().connect();
    try {
      await client.query('BEGIN');

      await client.query(
        'UPDATE loans SET return_date = CURRENT_TIMESTAMP WHERE id = $1',
        [loanId]
      );

      await client.query(
        'UPDATE books SET available_quantity = available_quantity + 1 WHERE id = $1',
        [bookId]
      );

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}