import { Author } from "../entities/book-author.js";

export interface AuthorRepository {
    save(author: Author): Promise<Author>;
    findAll(): Promise<Author[]>;
    findById(id: string): Promise<Author | null>; 
    update(author: Author): Promise<void>;
    delete(id: string): Promise<void>;
}


