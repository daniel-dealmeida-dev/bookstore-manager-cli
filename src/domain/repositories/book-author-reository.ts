import { Author } from "../entities/book-author";

export interface AuthorRepository{
    save(author : Author): Promise<Author>;
    findAll(): Promise<Author[]>;
}