import { Book } from '../entities/book.js';

export interface BookRepository {
  save(book: Book): Promise<void>; 
  findAll(): Promise<Book[]>;  
  findById(id: number): Promise<Book | null>;
  update(book: Book): Promise<void>;
  delete(id: number): Promise<void>;
}