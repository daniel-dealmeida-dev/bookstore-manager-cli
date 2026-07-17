export class Author {
  public readonly books: { id: number; title: string }[] = [];
  public readonly id: number | null;
  public readonly name: string;
  public readonly nationality: string;
  public readonly description: string;

  constructor(data: { id: number | null; name: string; nationality: string; description?: string }) {
    this.id = data.id;
    this.name = data.name;
    this.nationality = data.nationality;
    this.description = data.description || '';

    if (!this.name || this.name.trim().length < 3)
      throw new Error('O nome do autor deve ter ao menos 3 caracteres.');
    if (this.description && this.description.length > 500)
      throw new Error('A descrição não pode ultrapassar 500 caracteres.');
  }

  public addBook(book: { id: number; title: string }) {
    this.books.push(book);
  }
}