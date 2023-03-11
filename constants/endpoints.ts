export const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:13000";
export const COMMON_ENDPOINT = {
  IMPORT: "/import",
  EXPORT: "/export",
};
export const AUTH_ENDPOINT = {
  BASE: "/auth",
  LOGIN: "/login",
};
export const PROFILE_ENDPOINT = {
  BASE: "/profile",
};
export const STUDENT_MANAGEMENT_ENDPOINT = {
  BASE: "/student-management",
};
export const STUDENT_ENDPOINT = {
  BASE: "/student",
};
export const TEACHER_ENDPOINT = {
  BASE: "/teacher",
};
export const REQUEST_ENDPOINT = {
  BASE: "/request",
  SEND: "/send",
  ACCEPT: "/accept",
  REJECT: "/reject",
};
export const NOTIFICATION_ENDPOINT = {
  BASE: "/notification",
};
export const THESIS_PROGRESS_ENDPOINT = {
  BASE: "/thesis-progress",
  EVENT: {
    BASE: "/event",
    DELETE: "/delete",
  },
};
export const TOPIC_ENDPOINT = {
  BASE: "/topic",
  SEND: "/send",
};
export const TAG_ENDPOINT = {
  BASE: "/tag",
  MAJOR_TAGS: "/major",
};
export const THESIS_DEFENSE_SCHEDULE_ENDPOINT = {
  BASE: "/thesis-schedule",
  STUDENT_LIST: {
    BASE: "/student-list",
  },
  CALENDAR: {
    BASE: "/calendar",
    BUSY_LIST: "/busy-time",
    THESIS_DEFENSE_TIME: "/thesis-defense-time",
  },
};
