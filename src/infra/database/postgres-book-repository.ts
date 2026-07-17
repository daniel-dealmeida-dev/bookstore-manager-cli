import { BookRepository } from '../../domain/repositories/book-repository.js';
import { Book } from '../../domain/entities/book.js';
import { PgConnection } from './pg-connection.js';
import { Logger } from '../logger/logger.js';
import { DomainException, SystemException } from '../../domain/errors/index.js';

export class PostgresBookRepository implements BookRepository {
  constructor(private logger: Logger) {}

  async save(book: Book): Promise<void> {
    const client = await PgConnection.getInstance().connect();
    try {
      await client.query(
        'INSERT INTO books (title, author_id, available_quantity) VALUES ($1, $2, $3)',
        [book.title, book.authorId, book.availableQuantity],
      );
    } catch (e) {
      this.logger.error('Erro ao salvar livro', e);
      throw SystemException.fromUnknown(e, 'DATABASE_SAVE_ERROR');
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
    } catch (e) {
      this.logger.error(`Erro ao buscar livro ${id}`, e);
      throw SystemException.fromUnknown(e, 'DATABASE_QUERY_ERROR');
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
    } catch (e) {
      this.logger.error('Erro ao listar livros', e);
      throw SystemException.fromUnknown(e, 'DATABASE_QUERY_ERROR');
    } finally {
      client.release();
    }
  }

  async update(book: Book): Promise<void> {
    const client = await PgConnection.getInstance().connect();
    try {
      const res = await client.query(
        'UPDATE books SET title = $1, author_id = $2, available_quantity = $3 WHERE id = $4',
        [book.title, book.authorId, book.availableQuantity, book.id],
      );

      if (res.rowCount === 0) {
        throw new DomainException(
          `Livro com ID ${book.id} não encontrado para atualização.`,
        );
      }
    } catch (e) {
      if (e instanceof DomainException) throw e;
      this.logger.error(`Erro ao atualizar livro ${book.id}`, e);
      throw SystemException.fromUnknown(e, 'DATABASE_UPDATE_ERROR');
    } finally {
      client.release();
    }
  }

  async delete(id: number): Promise<void> {
    const client = await PgConnection.getInstance().connect();
    try {
      const res = await client.query(
        'UPDATE books SET is_active = false WHERE id = $1',
        [id],
      );

      if (res.rowCount === 0) {
        throw new DomainException(
          `Livro com ID ${id} não encontrado para exclusão.`,
        );
      }
    } catch (e) {
      if (e instanceof DomainException) throw e;
      this.logger.error(`Erro ao deletar livro ${id}`, e);
      throw SystemException.fromUnknown(e, 'DATABASE_DELETE_ERROR');
    } finally {
      client.release();
    }
  }
}
