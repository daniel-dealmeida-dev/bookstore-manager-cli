export class Loan {
  public readonly id: number | null;
  public readonly bookId: number;
  public readonly customerId: number;
  public readonly loanDate: Date | null;
  public readonly returnDate: Date | null;

  constructor(data: {
    id: number | null;
    bookId: number;
    customerId: number;
    loanDate?: Date | null;
    returnDate?: Date | null;
  }) {
    this.id = data.id;
    this.bookId = data.bookId;
    this.customerId = data.customerId;
    this.loanDate = data.loanDate ?? null;
    this.returnDate = data.returnDate ?? null;
  }

  public isReturned(): boolean {
    return this.returnDate !== null;
  }
}