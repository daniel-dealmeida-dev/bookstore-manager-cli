export class Author {
  public readonly books: { id: number; title: string }[] = [];

  constructor(
    public readonly id: number | null,
    public readonly name: string,
    public readonly nationality: string,
    public readonly description: string = '',
  ) {
    if (!name || name.trim().length < 3) {
      throw new Error('O nome do autor deve ter ao menos 3 caracteres.');
    }
    if (description && description.length > 500) {
      throw new Error('A descrição não pode ultrapassar 500 caracteres.');
    }
  }

  public addBook(book: { id: number; title: string }) {
    this.books.push(book);
  }
}
