export enum Roles {
  STUDENT = "ROLE_STUDENT",
  TEACHER = "ROLE_TEACHER",
  ADMIN = "ROLE_ADMIN",
}
export enum TopicStatus {
  Pending = "pending",
  RequestChange = "requestChange",
  Accepted = "accepted",
}
export enum ThesisStatus {
  IsReadyForThesisDefense = "isReadyForThesisDefense",
  IsHadThesisDefenseSchedule = "isHadThesisDefenseSchedule",
  IsMarkedForIncomplete = "isMarkedForIncomplete",
}
export enum ScheduleEventType {
  BusyEvent = "busyEvent",
  ThesisDefenseEvent = "thesisDefenseEvent",
}
export enum Slot {
  Slot1 = 1, //7h-8h
  Slot2 = 2, //8h-9h
  Slot3 = 3, //9h-10h
  Slot4 = 4, //10h-11h
  Slot5 = 5, //11h-12h
  Slot6 = 6, //13h-14h
  Slot7 = 7, //14h-5h
  Slot8 = 8, //15h-16h
  Slot9 = 9, //16h-17h
  Slot10 = 10, //17h-18h
}
