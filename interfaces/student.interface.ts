import { ThesisStatus } from "../constants/enums";
import { Teacher } from "./teacher.interface";
import { Topic } from "./topic.interface";
import { User } from "./user.interface";

export interface Student extends User {
  MSSV: string;
  class: string;
  major: string;
  department: string;
  sentRequestsList: string[];
  topic?: Topic;
  teacher?: Teacher;
  sentTopic?: Topic;
  thesisProgress?: any;
  reportSchedule?: any;
  status?: ThesisStatus;
}
