import { BookRepository } from '../../domain/repositories/book-repository.js';
import { CreateBookDTO } from '../../domain/dto/system-dto.js';
import { Book } from '../../domain/entities/book.js';
export class CreateBookUseCases {
  constructor(private repo: BookRepository) {}

  async execute(data: CreateBookDTO) {
    const book = new Book({
      id: 0, 
      title: data.title,
      authorId: data.authorId,
      availableQuantity: data.quantity
    });
    
    await this.repo.save(book);
  }
}