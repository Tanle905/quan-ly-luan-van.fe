import { ScheduleEventType, Slot, ThesisStatus } from "../constants/enums";
import { CalendarEvent } from "./calendar.interface";
import { Student } from "./student.interface";

export interface BusyTime extends CalendarEvent {
  MSCB: string;
  teacherName: string;
  slots: Slot[];
}

export interface ThesisDefenseTime extends CalendarEvent {
  MSCB: string[];
  MSSV: string;
  studentName: string;
  teacherName: string;
  topic: string;
  slots: Slot;
}

export interface ScheduleEventTime {
  type: ScheduleEventType;
  busyTimeData?: BusyTime;
  thesisDefenseTimeData?: ThesisDefenseTime;
}

export interface ScheduleCalendar {
  scheduleEventList: ScheduleEventTime[];
  reportPrepareWeek: CalendarEvent;
  thesisDefenseWeek: CalendarEvent;
}

export interface ThesisDefenseSchedule {
  studentLists: StudentList[];
  /**
   * Data for client rendering.
   */
  calendar?: ScheduleCalendar;
}

export interface StudentList {
  MSCB: string;
  teacherName: string;
  students: Student[];
  incompleteStudents: Student[];
  createdAt?: Date;
  updatedAt?: Date;
}
