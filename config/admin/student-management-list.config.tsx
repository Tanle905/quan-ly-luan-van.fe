import { AtomStudentTableAction } from "../../components/atoms/action/student-table-action.atom";
import {} from "../../components/atoms/action/teacher-table-action.atom";
import { AtomExportButton } from "../../components/atoms/button/export-button.atom";
import { STUDENT_MANAGEMENT_ENDPOINT } from "../../constants/endpoints";
import { TableConfig } from "../interface/table-config.interface";

export const studentManagementListConfig: TableConfig = {
  apiEndpoint: STUDENT_MANAGEMENT_ENDPOINT.BASE,
  title: "Quản lý sinh viên",
  search: true,
  extraRightComponent: [
    ({ key, href }) => href && <AtomExportButton key={key} href={href} />,
  ],
  table: {
    columns: [
      {
        key: "MSSV",
        title: "MSSV",
        dataIndex: "MSSV",
        sorter: true,
      },
      {
        key: "name",
        title: "Họ và Tên",
        dataIndex: "firstName",
        sorter: true,

        render: (text, record: any) => (
          <span>
            {record.lastName} {record.firstName}
          </span>
        ),
      },
      {
        key: "email",
        title: "Email",
        dataIndex: "email",
        sorter: true,
      },
      {
        key: "topicName",
        title: "Tên đề tài",
        dataIndex: "topicName",
        sorter: true,
      },
      {
        key: "action",
        width: "10%",
        title: "Hành động",
        render: (text, student: any) => (
          <AtomStudentTableAction student={student} />
        ),
      },
    ],
  },
};
