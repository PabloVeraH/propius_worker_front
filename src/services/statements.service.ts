import { api } from '@/lib/api';
import { Statement } from '@/types/statement';

export const statementsService = {
  getByCommunity: (communityId: string) =>
    api.get<Statement[]>('/property-statements', {
      params: { communityId },
    }),

  generate: (month: string) =>
    api.post('/property-statements/generate', { month }),
};
