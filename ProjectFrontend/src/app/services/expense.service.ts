import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private endpoint = 'expenses';

  constructor(private api: ApiService) {}

  getAllExpenses(): Observable<Expense[]> {
    return this.api.get<Expense[]>(this.endpoint);
  }

  getExpenseById(id: number): Observable<Expense> {
    return this.api.get<Expense>(this.endpoint + '/' + id);
  }

  createExpense(expense: Expense): Observable<Expense> {
    return this.api.post<Expense>(this.endpoint, expense);
  }

  updateExpense(id: number, expense: Expense): Observable<Expense> {
    return this.api.put<Expense>(this.endpoint + '/' + id, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.api.delete<void>(this.endpoint + '/' + id);
  }
}