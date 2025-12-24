export interface Statement {
  id: string;
  propertyId: string;
  month: string; // YYYY-MM
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  generatedAt: string;
}

export interface StatementDetail {
  id: string;
  statementId: string;
  description: string;
  amount: number;
}
