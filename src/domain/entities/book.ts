// src/domain/entities/book.ts
export class Book {
  public readonly id: number;
  public readonly title: string;
  public readonly authorId: number;
  public readonly availableQuantity: number;

  // AQUI É O SEGREDO: O construtor recebe APENAS UM parâmetro (o objeto)
  constructor(data: { id: number; title: string; authorId: number; availableQuantity: number }) {
    this.id = data.id;
    this.title = data.title;
    this.authorId = data.authorId;
    this.availableQuantity = data.availableQuantity;
    
    if (this.availableQuantity < 0) {
      throw new Error('A quantidade não pode ser negativa.');
    }
  }
}