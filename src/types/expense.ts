export interface MasterExpense {
  id: string;
  description: string;
  category: string | { id: string; name: string; kind?: string };
  amount?: number; // Base amount?
  expenseDate?: string | object; // Can be string or empty object from API
  categoryId?: string;
}

export interface Expense {
  id: string;
  communityId?: string;
  expenseId?: string; // Link to master expense
  masterExpense?: MasterExpense; // Joined data
  expense?: MasterExpense; // Relation alias?
  allocatedAmount?: number;
  amount?: number; // Alias?
  date?: string; // ISO Date
  createdAt?: string;
  expenseDate?: string; // Alternative date field
  // Direct fields (when returned from /expenses instead of /community-expenses)
  description?: string;
  category?: MasterExpense | string; // Can be object or string
  categoryId?: string;
  updatedAt?: string;
}

export interface CreateExpenseDTO {
  expenseId: string;
  communityId: string;
  allocatedAmount: number;
}

export interface UpdateExpenseDTO extends Partial<CreateExpenseDTO> { }
