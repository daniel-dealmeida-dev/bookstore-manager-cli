import { PgConnection } from './pg-connection.js';

export class PostgresLoanRepository {
  async createLoan(data: {
    bookId: number;
    customerId: number;
  }): Promise<void> {
    const client = await PgConnection.getInstance().connect();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        'UPDATE books SET available_quantity = available_quantity - 1 WHERE id = $1 AND available_quantity > 0',
        [data.bookId],
      );

      if (result.rowCount === 0) {
        throw new Error(
          'O UPDATE falhou: Verifique se o ID existe e se a quantidade é maior que 0.',
        );
      }

      await client.query(
        'INSERT INTO loans (book_id, customer_id) VALUES ($1, $2)',
        [data.bookId, data.customerId],
      );

      await client.query('COMMIT');
      console.log('✔ Empréstimo registrado e estoque atualizado!');
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('❌ ERRO NO BANCO:', e);
      throw e;
    } finally {
      client.release();
    }
  }

  async findActiveLoans(): Promise<any[]> {
    const client = await PgConnection.getInstance().connect();
    try {
      const query = `
        SELECT l.id, l.book_id, b.title as book_title, c.name as customer_name 
        FROM loans l
        JOIN books b ON l.book_id = b.id
        JOIN customers c ON l.customer_id = c.id
        WHERE l.return_date IS NULL
      `;
      const { rows } = await client.query(query);
      return rows;
    } finally {
      client.release();
    }
  }

  async getActiveLoansReport(): Promise<any[]> {
    const client = await PgConnection.getInstance().connect();
    try {
      const query = `
      SELECT 
        b.title as livro, 
        c.name as cliente, 
        TO_CHAR(l.loan_date, 'DD/MM/YYYY') as data
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN customers c ON l.customer_id = c.id
      WHERE l.return_date IS NULL
    `;
      const { rows } = await client.query(query);
      return rows;
    } finally {
      client.release();
    }
  }

  async getPopularBooksReport(): Promise<any[]> {
    const client = await PgConnection.getInstance().connect();
    try {
      const query = `
        SELECT b.title as titulo, COUNT(l.id) as total_emprestimos
        FROM loans l
        JOIN books b ON l.book_id = b.id
        GROUP BY b.title
        ORDER BY total_emprestimos DESC
        LIMIT 5
      `;
      const { rows } = await client.query(query);
      return rows;
    } finally {
      client.release();
    }
  }

  async returnBook(data: { loanId: number; bookId: number }): Promise<void> {
    const { loanId, bookId } = data;
    const client = await PgConnection.getInstance().connect();
    try {
      await client.query('BEGIN');
      await client.query(
        'UPDATE loans SET return_date = CURRENT_TIMESTAMP WHERE id = $1',
        [loanId],
      );
      await client.query(
        'UPDATE books SET available_quantity = available_quantity + 1 WHERE id = $1',
        [bookId],
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
