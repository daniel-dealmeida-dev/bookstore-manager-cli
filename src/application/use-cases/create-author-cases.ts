import { Author } from "../../domain/entities/book-author.js";
import { AuthorRepository } from "../../domain/repositories/book-author-repository.js";

export class CreateAuthorUseCase {
    constructor(private authorRepository: AuthorRepository) {}

    async execute(id: number | null, nome: string, nacionalidade: string, description: string): Promise<Author> {
        if (!nome || nome.trim() === '') {
            throw new Error("O nome do autor é obrigatório.");
        }

        const author = new Author(id, nome, nacionalidade, description);
        
        return await this.authorRepository.save(author);
    }
}