import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../../services/expense.service';
import { Expense } from '../../../models/expense.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  isEdit = false;
  success = '';
  error = '';
  currentExpense: any = { title: '', category: 'Utility', amount: 5000, expenseDate: new Date().toISOString().substring(0, 10), description: '' };

  constructor(private es: ExpenseService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.es.getAllExpenses().subscribe({
      next: (d) => this.expenses = d,
      error: () => this.error = 'Failed to load expenses.'
    });
  }

  saveExpense(): void {
    if (!this.currentExpense.title) {
      this.error = 'Expense title is required.';
      return;
    }
    this.es.createExpense(this.currentExpense).subscribe({
      next: () => {
        this.success = 'Society expense recorded!';
        this.resetForm();
        this.loadExpenses();
      },
      error: () => this.error = 'Failed to record expense.'
    });
  }

  editExpense(e: Expense): void {
    this.isEdit = true;
    this.success = '';
    this.error = '';
    this.currentExpense = { ...e };
  }

  updateExpense(): void {
    if (!this.currentExpense.id) return;
    this.es.updateExpense(this.currentExpense.id, this.currentExpense).subscribe({
      next: () => {
        this.success = 'Expense entry updated!';
        this.resetForm();
        this.loadExpenses();
      },
      error: () => this.error = 'Failed to update expense.'
    });
  }

  deleteExpense(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this expense record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc3545'
    }).then((res) => {
      if (res.isConfirmed) {
        this.es.deleteExpense(id).subscribe({
          next: () => {
            this.success = 'Expense record deleted!';
            this.loadExpenses();
          },
          error: () => this.error = 'Failed to delete expense.'
        });
      }
    });
  }

  resetForm(): void {
    this.isEdit = false;
    this.currentExpense = { title: '', category: 'Utility', amount: 5000, expenseDate: new Date().toISOString().substring(0, 10), description: '' };
    this.error = '';
  }
}
