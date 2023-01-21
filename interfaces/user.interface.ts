export interface User {
  username: string;
  email: string;
  roles?: string[];
  password: string;
  MSSV?: string;
  MSCB?: string;
  imageUrl?: string;
  phoneNumber?: number;
  name?: string;
  isDeactivated?: boolean;
}
