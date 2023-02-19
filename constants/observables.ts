import { Subject } from "rxjs";

export const requestSendSubject = new Subject();
export const calendarEventSendSubject = new Subject();
//table observables
export const onSearchTableSubject = new Subject();
export const onFilterTableSubject = new Subject();
export const onModifyFileListSubject = new Subject();

