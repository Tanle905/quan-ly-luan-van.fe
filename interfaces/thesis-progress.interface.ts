import { CalendarEvent } from "./calendar.interface";

export interface ThesisProgress {
  MSSV: string;
  MSCB: string;
  events?: CalendarEvent[];
  files?: any[];
}
