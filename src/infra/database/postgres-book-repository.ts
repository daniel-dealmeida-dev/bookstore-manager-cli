import { BookRepository } from '../../domain/repositories/book-repository.js';
import { Book } from '../../domain/entities/book.js';
import { PgConnection } from './pg-connection.js';
import { Logger } from '../logger/logger.js';

export class PostgresBookRepository implements BookRepository {
  constructor(private logger: Logger) {}

  async save(book: Book): Promise<void> {
    const client = await PgConnection.getInstance().connect();
    try {
      await client.query(
        'INSERT INTO books (title, author_id, available_quantity) VALUES ($1, $2, $3)',
        [book.title, book.authorId, book.availableQuantity],
      );
    } finally {
      client.release();
    }
  }

  async findById(id: number): Promise<Book | null> {
    const client = await PgConnection.getInstance().connect();
    try {
      const { rows } = await client.query(
        'SELECT * FROM books WHERE id = $1 AND is_active = true',
        [id],
      );
      if (rows.length === 0) return null;
      return new Book({
        id: rows[0].id,
        title: rows[0].title,
        authorId: rows[0].author_id,
        availableQuantity: rows[0].available_quantity,
      });
    } finally {
      client.release();
    }
  }

  async findAll(): Promise<Book[]> {
    const client = await PgConnection.getInstance().connect();
    try {
      const { rows } = await client.query(
        'SELECT * FROM books WHERE is_active = true',
      );
      return rows.map(
        (r) =>
          new Book({
            id: r.id,
            title: r.title,
            authorId: r.author_id,
            availableQuantity: r.available_quantity,
          }),
      );
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
      await client.query('UPDATE books SET is_active = false WHERE id = $1', [
        id,
      ]);
    } finally {
      client.release();
    }
  }
}
