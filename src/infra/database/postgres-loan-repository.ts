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


  async getActiveLoansReport(): Promise<any[]> {
    const client = await PgConnection.getInstance().connect();
    try {
      const query = `
        SELECT 
          b.title as "Livro", 
          c.name as "Cliente", 
          TO_CHAR(l.loan_date, 'DD/MM/YYYY') as "Data do Empréstimo"
        FROM loans l
        JOIN books b ON l.book_id = b.id
        JOIN customers c ON l.customer_id = c.id
        WHERE l.return_date IS NULL`;
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
        SELECT b.title as "Título do Livro", COUNT(l.id) as "Total de Empréstimos"
        FROM loans l
        JOIN books b ON l.book_id = b.id
        GROUP BY b.title
        ORDER BY "Total de Empréstimos" DESC LIMIT 5`;
      const { rows } = await client.query(query);
      return rows;
    } finally {
      client.release();
    }
  }

  async getAvailableBooksReport(): Promise<any[]> {
    const client = await PgConnection.getInstance().connect();
    try {
      const { rows } = await client.query(
        'SELECT title as "Título", available_quantity as "Qtd. Disponível" FROM books WHERE available_quantity > 0 AND is_active = true',
      );
      return rows;
    } finally {
      client.release();
    }
  }

  async getBooksByAuthorReport(): Promise<any[]> {
    const client = await PgConnection.getInstance().connect();
    try {
      const query = `
        SELECT a.name as "Autor", b.title as "Título do Livro"
        FROM authors a
        JOIN books b ON a.id = b.author_id
        WHERE a.is_active = true
        ORDER BY "Autor"`;
      const { rows } = await client.query(query);
      return rows;
    } finally {
      client.release();
    }
  }

  async getActiveBorrowersReport(): Promise<any[]> {
    const client = await PgConnection.getInstance().connect();
    try {
      const query = `
        SELECT DISTINCT c.name as "Nome do Cliente", c.email as "E-mail"
        FROM customers c
        JOIN loans l ON c.id = l.customer_id
        WHERE l.return_date IS NULL`;
      const { rows } = await client.query(query);
      return rows;
    } finally {
      client.release();
    }
  }

  async getClientHistoryReport(customerId: number): Promise<any[]> {
    const client = await PgConnection.getInstance().connect();
    try {
      const query = `
        SELECT 
          b.title as "Livro", 
          TO_CHAR(l.loan_date, 'DD/MM/YYYY') as "Data do Empréstimo", 
          COALESCE(TO_CHAR(l.return_date, 'DD/MM/YYYY'), 'Em aberto') as "Data de Devolução"
        FROM loans l
        JOIN books b ON l.book_id = b.id
        WHERE l.customer_id = $1
        ORDER BY l.loan_date DESC`;
      const { rows } = await client.query(query, [customerId]);
      return rows;
    } finally {
      client.release();
    }
  }

  async getAuthorsWithMostBooksReport(): Promise<any[]> {
    const client = await PgConnection.getInstance().connect();
    try {
      const query = `
        SELECT a.name as "Autor", COUNT(b.id) as "Total de Livros"
        FROM authors a
        LEFT JOIN books b ON a.id = b.author_id
        GROUP BY a.name
        ORDER BY "Total de Livros" DESC`;
      const { rows } = await client.query(query);
      return rows;
    } finally {
      client.release();
    }
  }

  async getNeverBorrowedBooksReport(): Promise<any[]> {
    const client = await PgConnection.getInstance().connect();
    try {
      const query = `
        SELECT b.title as "Título"
        FROM books b
        LEFT JOIN loans l ON b.id = l.book_id
        WHERE l.id IS NULL AND b.is_active = true`;
      const { rows } = await client.query(query);
      return rows;
    } finally {
      client.release();
    }
  }
}
