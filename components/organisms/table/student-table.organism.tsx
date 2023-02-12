import { Input, Layout, message, Table, Tag, Typography } from "antd";
import axios from "axios";
import { useEffect } from "react";
import {
  STUDENT_ENDPOINT,
  TEACHER_ENDPOINT,
} from "../../../constants/endpoints";
import useSWR from "swr";
import { requestSendSubject } from "../../../constants/observables";
import { useRecoilValue } from "recoil";
import { userState } from "../../../stores/auth.store";
import { Teacher } from "../../../interfaces/teacher.interface";
import { Student } from "../../../interfaces/student.interface";
import { studentListConfig } from "../../../config/teacher/student-list.config";

interface OGStudentTableProps {}

export function OGStudentTable({}: OGStudentTableProps) {
  const user = useRecoilValue<Teacher | null>(userState);
  const [msg, contextHolder] = message.useMessage();
  const { data, isLoading, isValidating, mutate } = useSWR<
    Student[] | undefined
  >(
    user && process.env.NEXT_PUBLIC_BASE_URL + TEACHER_ENDPOINT.BASE,
    studentListFetcher
  );

  useEffect(() => {
    const requestSendSubscription = requestSendSubject.subscribe({
      next: () => mutate(),
    });

    return () => {
      requestSendSubscription.unsubscribe();
    };
  }, []);

  async function studentListFetcher() {
    try {
      const { data }: { data: { data: Student[] } } = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + STUDENT_ENDPOINT.BASE,
        { studentList: user?.studentList }
      );

      return data.data;
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  if (!data) return null;

  return (
    <>
      {contextHolder}
      <Layout.Content className="mx-20 px-5 bg-white rounded-md shadow-md">
        <Layout.Content className="mt-20">
          <Layout.Content className="flex justify-between space-x-5 px-1 py-5">
            <Layout.Content className="flex items-center space-x-5">
              <Typography.Title
                level={5}
                style={{ marginBottom: 0 }}
                className="m-0"
              >
                {studentListConfig.title}
              </Typography.Title>
              {studentListConfig.subTitle && (
                <Tag className="rounded-lg">{studentListConfig.subTitle}</Tag>
              )}
            </Layout.Content>
            <Layout.Content className="flex items-center">
              {studentListConfig.search && <Input.Search />}
              {studentListConfig.extraComponent &&
                studentListConfig.extraComponent.map((component) => component)}
            </Layout.Content>
          </Layout.Content>
          <Table
            loading={isLoading || isValidating}
            pagination={{ pageSize: 10 }}
            bordered
            columns={studentListConfig.table.columns}
            dataSource={data.map((data, index) => {
              return {
                key: index,
                ...data,
              };
            })}
          />
        </Layout.Content>
      </Layout.Content>
    </>
  );
}
