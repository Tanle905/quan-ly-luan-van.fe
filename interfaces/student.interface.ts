import { User } from "./user.interface";

export interface Student extends User {
  MSSV: string;
  sentRequestList?: string[];
  topic?: any;
  teacher?: any;
  thesisProgress?: any;
  reportSchedule?: any;
}
