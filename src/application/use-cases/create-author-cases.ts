import { Author } from '../../domain/entities/book-author.js';
import { AuthorRepository } from '../../domain/repositories/book-author-repository.js';
import { CreateAuthorDTO } from '../../domain/dto/system-dto.js';

export class CreateAuthorUseCase {
  constructor(private authorRepository: AuthorRepository) {}

  async execute(data: CreateAuthorDTO): Promise<Author> {
    const author = new Author({
      id: data.id,
      name: data.name,
      nationality: data.nationality,
      description: data.description
    });
    
    return await this.authorRepository.save(author);
  }
}