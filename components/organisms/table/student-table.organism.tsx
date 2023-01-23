import { Input, Layout, message, Table, Tag, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl, STUDENT_ENDPOINT, TEACHER_ENDPOINT } from "../../../constants/endpoints";
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
  const { data, mutate } = useSWR<Student[] | undefined>(
    user && baseUrl + TEACHER_ENDPOINT.BASE,
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
      const { data }: { data: { data: Student[] } } = await axios.get(
        baseUrl + STUDENT_ENDPOINT.BASE,
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      const transformedData = data.data.map((student) => {
        const newData = { ...student, ...student.profile };
        delete newData.profile;

        return newData;
      });
      return transformedData;
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  }

  if (!data) return;

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