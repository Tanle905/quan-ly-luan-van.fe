import { Request } from "./request.interface";
import { Student } from "./student.interface";
import { User } from "./user.interface";

export interface Teacher extends User {
  MSCB: string;
  major: any;
  receivedRequestList: Request[];
  studentList: Student[];
  reportSchedule: any[];
  profile?: User; //virtual field
  createdAt?: Date;
  updatedAt?: Date;
}
