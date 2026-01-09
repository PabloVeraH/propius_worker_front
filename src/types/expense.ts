export interface MasterExpense {
  id: string;
  description: string;
  category: string;
  amount?: number; // Base amount?
}

export interface Expense {
  id: string;
  communityId: string;
  expenseId: string; // Link to master expense
  masterExpense?: MasterExpense; // Joined data
  allocatedAmount: number;
  date: string; // ISO Date
  // description/category might come from masterExpense now
}

export interface CreateExpenseDTO {
  expenseId: string;
  communityId: string;
  allocatedAmount: number;
}

export interface UpdateExpenseDTO extends Partial<CreateExpenseDTO> { }
