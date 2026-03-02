export interface Category {
  id: string;
  name: string;
}

export interface Consignment {
  id: string;
  propertyId: string;
  categoryId: string;
  property?: {
    id: string;
    name: string;
    communityId: string;
    ownerName?: string;
  };
  category?: {
    id: string;
    name: string;
  };
  createdAt?: string;
}

export interface CreateConsignmentDTO {
  propertyId: string;
  categoryId: string;
}

export interface UpdateConsignmentDTO {
  propertyId?: string;
  categoryId?: string;
}
