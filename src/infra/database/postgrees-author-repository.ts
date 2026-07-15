import { Author} from "../../domain/entities/book-author";
import { AuthorRepository } from "../../domain/repositories/book-author-repository";



export interface Logger{
    info(message: string):void;
    erro(message:string, error: any): void;
}



export class PostgresAuthorRepository implements AuthorRepository {
    constructor(private logger: Logger){}

    async save(author: Author): Promise<Author>{
        this.logger.info(`Persistindo autor: ${author.nome}`);

        return author;
    }

    async findAll(): Promise<Author[]>{
        this.logger.info('Buscando todos os autores');
        const authors: Author[] =  [];
        return authors;
    }
}