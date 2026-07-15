import { Author } from "../../domain/entities/book-author.js";
import { AuthorRepository } from "../../domain/repositories/book-author-repository.js";

export class CreateAuthorUseCase {
    constructor(private authorRepository: AuthorRepository) {}

    async execute(id: string | null, nome: string, nacionalidade: string): Promise<Author> {
        // Validação básica que havíamos discutido
        if (!nome || nome.trim() === '') {
            throw new Error("O nome do autor é obrigatório.");
        }

        const author = new Author(id, nome, nacionalidade);
        return await this.authorRepository.save(author);
    }
}