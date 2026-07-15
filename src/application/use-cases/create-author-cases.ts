import { Author   } from "../../domain/entities/book-author";
import { AuthorRepository } from "../../domain/repositories/book-author-repository";

export class CreateAuthorUseCase{
    constructor(private authorRepository: AuthorRepository){}

    async execute(id: string | null, name: string, nationality: string) : Promise<Author>{
        if(!name || name.trim() === ''){
            throw new Error("O nome do autor é obrigatório.");
        }
        
        const author = new Author(id, name, nationality);
        return await this.authorRepository.save(author);
    }

}