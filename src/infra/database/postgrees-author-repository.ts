import { Author } from '../../domain/entities/book-author.js';
import { AuthorRepository } from '../../domain/repositories/book-author-repository.js';
import { PgConnection } from './pg-connection.js';
import { Logger } from '../logger/logger.js';

export class PostgresAuthorRepository implements AuthorRepository {
  constructor(private logger: Logger) {}

  async save(author: Author): Promise<Author> {
    this.logger.info(`Salvando autor: ${author.name}`);
    const client = await PgConnection.getInstance().connect();
    try {
      const query =
        'INSERT INTO authors (name, nationality, description) VALUES ($1, $2, $3) RETURNING id';
      const result = await client.query(query, [
        author.name,
        author.nationality,
        author.description,
      ]);
      return new Author({
        id: result.rows[0].id,
        name: author.name,
        nationality: author.nationality,
        description: author.description,
      });
    } catch (error) {
      this.logger.error('Erro ao salvar no banco', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async findAll(): Promise<Author[]> {
    this.logger.info('Buscando todos os autores');
    const client = await PgConnection.getInstance().connect();
    try {
      const result = await client.query(
        'SELECT id, name, nationality, description FROM authors WHERE is_active = true',
      );
      return result.rows.map(
        (row) =>
          new Author({
            id: row.id,
            name: row.name,
            nationality: row.nationality,
            description: row.description,
          }),
      );
    } catch (error) {
      this.logger.error('Erro ao buscar autores', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async findByIdWithBooks(id: number): Promise<Author | null> {
    this.logger.info(`Consultando autor detalhado: ${id}`);
    const client = await PgConnection.getInstance().connect();
    try {
      const query = `SELECT a.id, a.name, a.nationality, a.description, b.id as book_id, b.title 
                     FROM authors a LEFT JOIN books b ON a.id = b.author_id WHERE a.id = $1 AND a.is_active = true`;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) return null;

      const author = new Author({
        id: result.rows[0].id,
        name: result.rows[0].name,
        nationality: result.rows[0].nationality,
        description: result.rows[0].description,
      });
      result.rows.forEach((r) => {
        if (r.book_id) author.addBook({ id: r.book_id, title: r.title });
      });
      return author;
    } catch (error) {
      this.logger.error(`Erro ao consultar autor ${id}`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  async findById(id: number | string): Promise<Author | null> {
    const client = await PgConnection.getInstance().connect();
    try {
      const result = await client.query(
        'SELECT id, name, nationality, description FROM authors WHERE id = $1 AND is_active = true',
        [id],
      );
      if (result.rows.length === 0) return null;
      return new Author({
        id: result.rows[0].id,
        name: result.rows[0].name,
        nationality: result.rows[0].nationality,
        description: result.rows[0].description,
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar autor com ID ${id}`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  async update(author: Author): Promise<void> {
    const client = await PgConnection.getInstance().connect();
    try {
      await client.query(
        'UPDATE authors SET name = $1, nationality = $2, description = $3 WHERE id = $4',
        [author.name, author.nationality, author.description, author.id],
      );
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: string): Promise<void> {
    const client = await PgConnection.getInstance().connect();
    try {
      await client.query('UPDATE authors SET is_active = false WHERE id = $1', [
        id,
      ]);
    } finally {
      client.release();
    }
  }
}
