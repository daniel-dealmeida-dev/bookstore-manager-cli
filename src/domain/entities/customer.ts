export class Customer {
  constructor(
    public readonly id: number | null,
    public readonly name: string,
    public readonly email: string,
  ) {
    if (!name || name.trim().length < 3)
      throw new Error('O nome deve ter ao menos 3 caracteres.');
    if (!email.includes('@')) throw new Error('O e-mail informado é inválido.');
  }
}
