import { Student } from "./student.interface";
import { Teacher } from "./teacher.interface";

export interface User {
  _id: string;
  email: string;
  password: string;
  roles?: string[];
  MSSV?: string;
  MSCB?: string;
  teacherProfile?: Teacher;   //virtual field
  studentProfile?: Student;   //virtual field
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  phoneNumber?: number;
  isDeactivated?: boolean;
  ethnic?: string;
  religion?: string;
  CCCD?: string;
  accessToken?: string;
}
