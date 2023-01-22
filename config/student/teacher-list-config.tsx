import { TableConfig } from "./interface/table-config.interface";
import { AtomTeacherTableAction } from "../../components/atoms/action/teacher-table-action.atom";

export const teacherListConfig: TableConfig = {
  apiEndpoint: "",
  title: "Danh sách giảng viên",
  search: true,
  extraComponent: [],
  table: {
    columns: [
      {
        title: "MSCB",
        dataIndex: "MSCB",
      },
      {
        title: "Họ và Tên",
        dataIndex: "name",
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Chuyên ngành",
        dataIndex: "major",
        render: (major) => major.name,
      },
      {
        width: "10%",
        title: "Hành động",
        render: (text, teacher: any) => (
          <AtomTeacherTableAction teacher={teacher} />
        ),
      },
    ],
  },
};
