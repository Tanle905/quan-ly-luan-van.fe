import { Layout, Tabs, TabsProps, Typography } from "antd";
import { sentRequestListConfig } from "../../../config/student/sent-request-list.config";
import { teacherListConfig } from "../../../config/student/teacher-list-config";
import { receivedRequestListConfig } from "../../../config/teacher/received-request-list.config";
import { studentListConfig } from "../../../config/teacher/student-list.config";
import { isTeacher } from "../../../utils/role.util";
import { OGTable } from "../table/table.organism";

interface OGMainContentProps {}

const teacherContentItems: TabsProps["items"] = [
  {
    key: "1",
    label: `Chờ xác nhận`,
    children: <OGTable config={receivedRequestListConfig} key={1} />,
  },
  {
    key: "2",
    label: `Đang thực hiện luận văn`,
    children: <OGTable config={studentListConfig} key={2} />,
  },
];
const studentContentItems: TabsProps["items"] = [
  {
    key: "1",
    label: `Tất cả`,
    children: <OGTable config={teacherListConfig} key={1} />,
  },
  {
    key: "2",
    label: `Đã gửi yêu cầu`,
    children: <OGTable config={sentRequestListConfig} key={2} />,
  },
];

export function OGMainContent({}: OGMainContentProps) {
  return (
    <Layout.Content className="mx-20 my-5 space-y-3">
      <Typography.Title level={3} style={{ marginBottom: 0 }} className="m-0">
        Danh sách giảng viên
      </Typography.Title>
      {isTeacher() ? <TeacherContent /> : <StudentContent />}
    </Layout.Content>
  );
}

function TeacherContent() {
  return (
    <Tabs
      items={teacherContentItems}
      className="p-5 bg-white rounded-md shadow-md"
      destroyInactiveTabPane
    />
  );
}

function StudentContent() {
  return (
    <Tabs
      items={studentContentItems}
      className="p-5 bg-white rounded-md shadow-md"
      destroyInactiveTabPane
    />
  );
}
