import { Loan } from '../entities/loan.js';

export interface LoanRepository {
  createLoan(data: { bookId: number; customerId: number }): Promise<void>;
  returnBook(data: { loanId: number; bookId: number }): Promise<void>;
  findActiveLoans(): Promise<any[]>;
  getActiveLoansReport(): Promise<any[]>;
  getPopularBooksReport(): Promise<any[]>;
  getAvailableBooksReport(): Promise<any[]>;
  getBooksByAuthorReport(): Promise<any[]>;
  getActiveBorrowersReport(): Promise<any[]>;
  getClientHistoryReport(customerId: number): Promise<any[]>;
  getAuthorsWithMostBooksReport(): Promise<any[]>;
  getNeverBorrowedBooksReport(): Promise<any[]>;
}