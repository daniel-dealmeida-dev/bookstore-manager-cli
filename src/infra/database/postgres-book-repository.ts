import { BookRepository } from '../../domain/repositories/book-repository.js';
import { Book } from '../../domain/entities/book.js';
import { PgConnection } from './pg-connection.js';
import { Logger } from '../logger/logger.js';

export class PostgresBookRepository implements BookRepository {
  constructor(private logger: Logger) {}

  async save(title: string, authorId: number, quantity: number): Promise<void> {
    this.logger.info(`Salvando livro: ${title}`);
    const client = await PgConnection.getInstance().connect();
    try {
      await client.query(
        'INSERT INTO books (title, author_id, available_quantity) VALUES ($1, $2, $3)',
        [title, authorId, quantity],
      );
    } catch (error) {
      this.logger.error('Erro ao salvar livro', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async findAll(): Promise<any[]> {
    this.logger.info('Buscando todos os livros');
    const client = await PgConnection.getInstance().connect();
    try {
      const { rows } = await client.query(`
        SELECT b.*, a.name as author_name 
        FROM books b 
        JOIN authors a ON b.author_id = a.id
      `);
      return rows;
    } finally {
      client.release();
    }
  }

  async findById(id: number): Promise<Book | null> {
    const client = await PgConnection.getInstance().connect();
    try {
      const { rows } = await client.query('SELECT * FROM books WHERE id = $1', [
        id,
      ]);
      if (rows.length === 0) return null;

      const row = rows[0];
      return new Book(row.id, row.title, row.author_id, row.available_quantity);
    } finally {
      client.release();
    }
  }

  async update(book: Book): Promise<void> {
    const client = await PgConnection.getInstance().connect();
    try {
      await client.query(
        'UPDATE books SET title = $1, author_id = $2, available_quantity = $3 WHERE id = $4',
        [book.title, book.authorId, book.availableQuantity, book.id],
      );
    } finally {
      client.release();
    }
  }

  async delete(id: number): Promise<void> {
    const client = await PgConnection.getInstance().connect();
    try {
      await client.query('DELETE FROM books WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }
}
