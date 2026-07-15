import { Author} from "../../domain/entities/book-author";
import { AuthorRepository } from "../../domain/repositories/book-author-repository";
import { PgConnection } from "./pg-connection";
import { Logger } from "../logger/logger";




export class PostgresAuthorRepository implements AuthorRepository {
    constructor(private logger: Logger) {}

    async save(author: Author): Promise<Author> {
        this.logger.info(`Persistindo autor: ${author.name}`);
        
        const client = await PgConnection.getInstance().connect();
        try {
            const query = 'INSERT INTO authors (name, nationality) VALUES ($1, $2) RETURNING id';
            const result = await client.query(query, [author.name, author.nationality]);
            
            const generatedId = result.rows[0].id;
            return new Author(generatedId, author.name, author.nationality);
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
            const query = 'SELECT id, name, nationality FROM authors';
            const result = await client.query(query);
            
            return result.rows.map(row => new Author(row.id, row.name, row.nationality));
        } catch (error) {
            this.logger.error('Erro ao buscar autores', error);
            throw error;
        } finally {
            client.release();
        }
    }
}