import { CalendarEvent } from "./calendar.interface";
import { Student } from "./student.interface";
import { Teacher } from "./teacher.interface";

export interface StudentList {
  MSCB: string;
  teacherName: string;
  students: Student[];
  incompleteStudents: Student[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FreeTime extends CalendarEvent {
  /**
   * Data needed for calculation: busyTimesList & thesisDefenseTimesList.
   */
  calculatedFreeTeachersList: Teacher[];
}

export interface BusyTime extends CalendarEvent {
  MSCB: string;
  teacherName: string;
}

export interface ThesisDefenseTime extends CalendarEvent {
  MSCB: string;
  MSSV: string;
  studentName: string;
  teacherName: string;
  topicName: string;
}

export interface ScheduleCalendar {
  busyTimesList: BusyTime[];
  thesisDefenseTimesList: ThesisDefenseTime[];
  reportPrepareWeek: CalendarEvent;
  thesisDefenseWeek: CalendarEvent;
}

export interface CalculatedCalendar {
    /**
     * time that have 3 or more teachers.
     */
  calculatedFreeTimesList: FreeTime[];
}

export interface ThesisDefenseSchedule {
  studentLists: StudentList[];
  /**
   * Data for client rendering.
   */
  calendar?: ScheduleCalendar;
  calculatedCalendar?: CalculatedCalendar;
}
