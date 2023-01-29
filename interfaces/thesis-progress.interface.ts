import { CalendarEvent } from "./calendar.interface";

export interface ThesisProgress {
  MSSV: string;
  events?: CalendarEvent[];
  files?: any[];
}
