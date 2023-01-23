import { Roles } from "../constants/enums";
import { Student } from "../interfaces/student.interface";
import { Teacher } from "../interfaces/teacher.interface";

export function isTeacher(user: Student | Teacher) {
  return user.roles?.includes(Roles.TEACHER);
}
