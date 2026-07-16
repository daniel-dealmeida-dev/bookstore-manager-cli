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

      const generatedId = result.rows[0].id;
      return new Author(generatedId, author.name, author.nationality, author.description);
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
      const query = 'SELECT id, name, nationality, description FROM authors';
      const result = await client.query(query);

      return result.rows.map(
        (row) => new Author(row.id, row.name, row.nationality, row.description),
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
      const query = `
        SELECT a.id, a.name, a.nationality, a.description, b.id as book_id, b.title 
        FROM authors a 
        LEFT JOIN books b ON a.id = b.author_id 
        WHERE a.id = $1`;
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      const author = new Author(
        row.id,
        row.name,
        row.nationality,
        row.description,
      );

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
    this.logger.info(`Buscando autor pelo ID: ${id}`);
    const client = await PgConnection.getInstance().connect();
    try {
      const query = 'SELECT id, name, nationality, description FROM authors WHERE id = $1';
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return new Author(row.id, row.name, row.nationality, row.description);
    } catch (error) {
      this.logger.error(`Erro ao buscar autor com ID ${id}`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  async update(author: Author): Promise<void> {
    this.logger.info(`Atualizando autor: ${author.id}`);
    const client = await PgConnection.getInstance().connect();
    try {
      const query =
        'UPDATE authors SET name = $1, nationality = $2, description = $3 WHERE id = $4';
      await client.query(query, [
        author.name,
        author.nationality,
        author.description,
        author.id,
      ]);
    } catch (error) {
      this.logger.error(`Erro ao atualizar autor ${author.id}`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: string): Promise<void> {
    this.logger.info(`Removendo autor: ${id}`);
    const client = await PgConnection.getInstance().connect();
    try {
      const query = 'DELETE FROM authors WHERE id = $1';
      await client.query(query, [id]);
    } catch (error) {
      this.logger.error(`Erro ao remover autor ${id}`, error);
      throw error;
    } finally {
      client.release();
    }
  }
}