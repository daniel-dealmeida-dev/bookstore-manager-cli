export interface CreateBookDTO {
  title: string;
  authorId: number;
  quantity: number;
}

export interface CreateAuthorDTO {
  id: number | null;
  name: string;
  nationality: string;
  description: string;
}

export interface CreateCustomerDTO {
  name: string;
  email: string;
}