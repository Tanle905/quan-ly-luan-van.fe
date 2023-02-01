import { Request } from "./request.interface";
import { Teacher } from "./teacher.interface";
import { Topic } from "./topic.interface";
import { User } from "./user.interface";

export interface Student extends User {
  MSSV: string;
  class: string;
  major: string;
  department: string;
  sentRequestList: Request[];
  topic?: any;
  teacher?: Teacher;
  sentTopic?: Topic;
  thesisProgress?: any;
  reportSchedule?: any;
}
