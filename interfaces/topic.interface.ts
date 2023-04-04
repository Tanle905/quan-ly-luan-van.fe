import { TopicStatus } from "../constants/enums";
import { TagDetails } from "./tag.interface";

export interface Topic {
  _id?: string;
  MSSV: string;
  MSCB: string;
  studentName: string;
  topicName: string;
  topicEnglishName?: string;
  majorTag: TagDetails[];
  topicDescription: string;
  topicStatus?: TopicStatus;
  history?: Date[];
}
