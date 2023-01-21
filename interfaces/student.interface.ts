import { User } from "./user.interface";

export interface Student extends User {
  MSSV: string;
  isRequestSent?: boolean;
  topic?: any;
  teacher?: any;
  thesisProgress?: any;
  reportSchedule?: any;
}
