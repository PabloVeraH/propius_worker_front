import { useProperties } from './useProperties';
import { useExpenses } from './useExpenses';
import { useMessages } from './useMessages';
import { parseDecimal } from '@/lib/utils';

export function useDashboardStats() {
  const { properties, isLoading: propertiesLoading } = useProperties();
  const { expenses, isLoading: expensesLoading } = useExpenses();
  const { messages, isLoading: messagesLoading } = useMessages();

  const totalProperties = properties.length;

  const totalExpensesMonth = expenses.reduce((sum, e) => {
    const amount = parseDecimal(e.allocatedAmount ?? e.amount, 0);
    return sum + amount;
  }, 0);

  const unreadMessages = messages.length;

  const uniqueResidents = new Set(
    properties.flatMap((p) => [p.ownerId, p.tenantId].filter(Boolean))
  ).size;

  return {
    totalProperties,
    totalExpensesMonth,
    unreadMessages,
    uniqueResidents,
    isLoading: propertiesLoading || expensesLoading || messagesLoading,
  };
}
