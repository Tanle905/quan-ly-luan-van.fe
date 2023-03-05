import { Student } from "./student.interface";
import { Teacher } from "./teacher.interface";
import { Topic } from "./topic.interface";

export interface Request {
  _id: string;
  student: Student;
  teacher: Teacher;
  topic?: Topic;
  createdAt?: Date;
  updatedAt?: Date;
}
