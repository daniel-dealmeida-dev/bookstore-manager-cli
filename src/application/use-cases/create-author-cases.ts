import { Author } from "../../domain/entities/book-author.js";
import { AuthorRepository } from "../../domain/repositories/book-author-repository.js";

export class CreateAuthorUseCase {
    constructor(private authorRepository: AuthorRepository) {}

    async execute(id: number | null, name: string, nacionalidade: string, description: string): Promise<Author> {
        if (!name || name.trim() === '') {
            throw new Error("O nome do autor é obrigatório.");
        }

        const author = new Author(id, name, nacionalidade, description);
        
        return await this.authorRepository.save(author);
    }
}