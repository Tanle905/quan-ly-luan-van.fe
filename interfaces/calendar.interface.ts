export interface CalendarEvent {
  _id: string;
  id: string;
  start?: Date;
  end?: Date;
  title: string;
  description: string;
  allDay?: boolean;
}
