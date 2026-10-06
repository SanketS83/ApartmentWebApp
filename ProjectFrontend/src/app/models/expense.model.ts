export interface Expense {
  id?: number;
  title: string;
  category: string;
  amount: number;
  expenseDate: string;
  description?: string;
}