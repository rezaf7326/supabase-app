export interface Author {
  name: string;
  sur_name: string;
  email: string;
  updated_at: Date;
  user_id: string; // uuid
  country_id: number; // foreign key
}
