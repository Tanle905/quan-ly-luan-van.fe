export interface User {
  _id: string;
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
  accessToken?: string;
}
