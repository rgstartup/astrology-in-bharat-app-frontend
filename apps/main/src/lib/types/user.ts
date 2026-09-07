export interface User {
  id: string;
  name: string;
  email: string;
  roles?: string[];
  avatar?: string;
  phone?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}
