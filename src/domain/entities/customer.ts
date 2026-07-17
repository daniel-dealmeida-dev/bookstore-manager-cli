export class Customer {
  public readonly id: number | null;
  public readonly name: string;
  public readonly email: string;

  constructor(data: { id: number | null; name: string; email: string }) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;

    if (!this.name || this.name.trim().length < 3)
      throw new Error('O nome deve ter ao menos 3 caracteres.');
    if (!this.email.includes('@'))
      throw new Error('O e-mail informado é inválido.');
  }
}