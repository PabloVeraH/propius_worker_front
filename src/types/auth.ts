export interface CommunitySummary {
  id: string;
  name: string;
  role?: 'admin' | 'worker';
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isAdminCommunity: boolean;
  isWorker: boolean;
  isOwner: boolean;
  isTenant: boolean;
  adminCommunities: CommunitySummary[];
  workerCommunities: CommunitySummary[];
  communities: string[];
  ownedProperties: any[];
  rentedProperties: any[];
  role?: 'ADMIN' | 'WORKER';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
