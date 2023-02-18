import { Roles } from "../constants/enums";
import { LOCAL_STORAGE } from "../constants/local_storage_key";
import { User } from "../interfaces/user.interface";

export function isTeacher() {
  if (typeof window === "undefined") return false;

  const userData: User = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE.USER_DATA) as string
  );

  if (!userData) return false;

  return userData.roles?.includes(Roles.TEACHER);
}

export function isStudent() {
  if (typeof window === "undefined") return false;

  const userData: User = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE.USER_DATA) as string
  );

  if (!userData) return false;

  return userData.roles?.includes(Roles.STUDENT);
}

export function isAdmin() {
  if (typeof window === "undefined") return false;

  const userData: User = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE.USER_DATA) as string
  );

  if (!userData) return false;

  return userData.roles?.includes(Roles.ADMIN);
}
