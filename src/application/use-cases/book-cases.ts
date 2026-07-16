import { BookRepository } from "../../domain/repositories/book-repository.js";

export class CreateBookUseCases{
    constructor(private repo:BookRepository){}

    async execute(title: string, authorId: number, quantity: number){
        await this.repo.save(title, authorId, quantity);
    }
}