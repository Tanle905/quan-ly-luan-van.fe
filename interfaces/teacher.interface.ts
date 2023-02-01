import { Request } from "./request.interface";
import { Student } from "./student.interface";
import { Topic } from "./topic.interface";
import { User } from "./user.interface";

export interface Teacher extends User {
  MSCB: string;
  major: any;
  receivedRequestList: Request[];
  studentList: Student[];
  receivedTopicList: Topic[];
  reportSchedule: any[];
}
