import { User } from "./user.interface";

export interface Student extends User {
  MSSV: string;
  sentRequestList?: { MSCB: string; name: string; email: string }[];
  topic?: any;
  teacher?: any;
  thesisProgress?: any;
  reportSchedule?: any;
  profile?: any;
}
