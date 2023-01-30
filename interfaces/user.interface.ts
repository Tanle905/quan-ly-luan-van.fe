export interface User {
  _id: string;
  email: string;
  username: string;
  password: string;
  roles?: string[];
  MSSV?: string;
  MSCB?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  phoneNumber?: number;
  isDeactivated?: boolean;
  ethnic?: string;
  religion?: string;
  CCCD?: string;
  notificationCount: number;
  accessToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
