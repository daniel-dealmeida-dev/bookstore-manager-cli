import { Author } from "../entities/book-author.js";

export interface AuthorRepository {
    save(author: Author): Promise<Author>;
    findAll(): Promise<Author[]>;
}