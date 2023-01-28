export interface CalendarEvent {
  id?: string;
  start?: Date;
  end?: Date;
  title?: string;
  backgroundColor?: string;
  borderColor?: string;
  editable?: boolean;
  textColor?: string;
  resourceId?: string;
}
