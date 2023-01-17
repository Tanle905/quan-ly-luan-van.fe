import { Input, Layout, Table, Tag, Typography } from "antd";
import { teacherListConfig } from "../../../config/student/teacher-list-config";

const mockData = [
  {
    key: 1,
    name: "Tan",
    email: "tanle905@gmail.com",
    major: "CNTT",
  },
];

interface OGTeacherTableProps {}

export function OGTeacherTable({}: OGTeacherTableProps) {
  return (
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
          dataSource={mockData}
        />
      </Layout.Content>
    </Layout.Content>
  );
}
