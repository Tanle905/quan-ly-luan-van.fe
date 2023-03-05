import { Student } from "./student.interface";
import { User } from "./user.interface";

export interface Teacher extends User {
  MSCB: string;
  major: string;
  majorTags: any;
  studentList: Student[];
  reportSchedule: any[];
}
