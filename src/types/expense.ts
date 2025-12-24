export interface Expense {
  id: string;
  communityId: string;
  description: string;
  amount: number;
  date: string; // ISO Date
  category: 'MAINTENANCE' | 'UTILITIES' | 'SERVICES' | 'INSURANCE' | 'OTHER';
  propertyId?: string; // If assigned to specific property
}

export interface CreateExpenseDTO {
  communityId: string;
  description: string;
  amount: number;
  date: string;
  category: Expense['category'];
  propertyId?: string;
}

export interface UpdateExpenseDTO extends Partial<CreateExpenseDTO> { }
