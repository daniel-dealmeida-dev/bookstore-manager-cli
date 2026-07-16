import { Book }from "../entities/book.js";

export interface BookRepository{
    save(title: string, authorId: number, quantity: number): Promise<void>;
    findAll(): Promise<any[]>;
    findById(id: number): Promise<Book | null>;
    update(book: Book): Promise<void>;
    delete(id: number): Promise<void>;
}