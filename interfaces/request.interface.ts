export interface Request {
  _id: string;
  MSSV: string;
  MSCB: string;
  studentId: string;
  teacherId: string;
  studentName: string;
  teacherName: string;
  studentEmail: string;
  teacherEmail: string;
  createdAt?: Date;
  updatedAt?: Date;
}
