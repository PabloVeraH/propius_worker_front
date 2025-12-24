export interface Property {
  id: string;
  communityId: string;
  name: string;
  address?: string; // Backend might send it in community or not at all, but keeping optional just in case
  ownerName?: string; // Frontend computed or from owner object
  ownerId?: string;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  tenantId?: string | null;
  tenant?: {
    id: string;
    name: string;
    email: string;
  } | null;
  tenantName?: string; // Frontend mapped
  area?: number;
  squareMeters?: {
    s: number;
    e: number;
    d: number[];
  };
}

export interface CreatePropertyDTO {
  communityId: string;
  name: string;
  ownerId?: string;
  ownerName?: string; // Restored for frontend convenience/backend duality
  ownerEmail?: string;
  tenantId?: string;
  tenantName?: string;
  tenantEmail?: string;
  squareMeters: number;
}

export interface UpdatePropertyDTO extends Partial<CreatePropertyDTO> { }
