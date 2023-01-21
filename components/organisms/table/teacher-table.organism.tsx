import { Input, Layout, message, Table, Tag, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { teacherListConfig } from "../../../config/student/teacher-list-config";
import { baseUrl, TEACHER_ENDPOINT } from "../../../constants/endpoints";
import { Teacher } from "../../../interfaces/teacher.interface";

interface OGTeacherTableProps {}

export function OGTeacherTable({}: OGTeacherTableProps) {
  const [teacherData, setTeacherData] = useState<Teacher[]>();
  const [msg, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchData().then((result: any) => setTeacherData(result));
  }, []);

  async function fetchData() {
    try {
      const { data }: { data: { data: Teacher[] } } = await axios.get(
        baseUrl + TEACHER_ENDPOINT.BASE
      );
      const transformedData = data.data.map((teacher) => {
        const newData = { ...teacher, ...teacher.profile };
        delete newData.profile;

        return newData;
      });
      return transformedData;
    } catch (error: any) {
      message.error(error.message);
    }
  }

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
                {teacherListConfig.title}
              </Typography.Title>
              {teacherListConfig.subTitle && (
                <Tag className="rounded-lg">{teacherListConfig.subTitle}</Tag>
              )}
            </Layout.Content>
            <Layout.Content className="flex items-center">
              {teacherListConfig.search && <Input.Search />}
              {teacherListConfig.extraComponent &&
                teacherListConfig.extraComponent.map((component) => component)}
            </Layout.Content>
          </Layout.Content>
          <Table
            bordered
            columns={teacherListConfig.table.columns}
            dataSource={teacherData}
          />
        </Layout.Content>
      </Layout.Content>
    </>
  );
}
