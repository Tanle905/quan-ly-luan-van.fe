import { TopicStatus } from "../constants/enums";

export interface Topic {
  _id?: string;
  MSSV: string;
  MSCB: string;
  studentName:string;
  topicName: string;
  topicDescription: string;
  topicStatus?: TopicStatus;
}
