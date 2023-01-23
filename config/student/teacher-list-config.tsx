import { TableConfig } from "../interface/table-config.interface";
import { AtomTeacherTableAction } from "../../components/atoms/action/teacher-table-action.atom";

export const teacherListConfig: TableConfig = {
  apiEndpoint: "",
  title: "Danh sách giảng viên",
  search: true,
  extraComponent: [],
  table: {
    columns: [
      {
        key: "MSCB",
        title: "MSCB",
        dataIndex: "MSCB",
      },
      {
        key: "name",
        title: "Họ và Tên",
        dataIndex: "name",
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
      },
      {
        key: "major",
        title: "Chuyên ngành",
        dataIndex: "major",
        render: (major) => major.name,
      },
      {
        key: "action",
        width: "10%",
        title: "Hành động",
        render: (text, teacher: any) => (
          <AtomTeacherTableAction teacher={teacher} />
        ),
      },
    ],
  },
};
