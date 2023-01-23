import { Roles } from "../constants/enums";
import { LOCAL_STORAGE } from "../constants/local_storage_key";
import { Student } from "../interfaces/student.interface";
import { Teacher } from "../interfaces/teacher.interface";

export function isTeacher() {
  if (typeof window === "undefined") return false;

  const userData: Student | Teacher = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE.USER_DATA) as string
  );

  if (!userData) return false;

  return userData.roles?.includes(Roles.TEACHER);
}
