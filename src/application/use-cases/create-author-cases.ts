import { Author   } from "../../domain/entities/book-author";
import { AuthorRepository } from "../../domain/repositories/book-author-repository";

export class CreateAuthorUseCase{
    constructor(private authorRepository: AuthorRepository){}

    async execute(id: string | null, nome: string, nacionalidade: string) : Promise<Author>{
        const author = new Author(id, nome, nacionalidade);

        return await this.authorRepository.save(author);
    }

}