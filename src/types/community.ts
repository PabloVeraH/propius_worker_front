export interface Community {
  id: string;
  name: string;
  address?: string;
  logoUrl?: string;
}

export interface CommunityContextType {
  activeCommunityId: string | null;
  setActiveCommunityId: (id: string | null) => void;
  communities: Community[];
  isLoading: boolean;
}
