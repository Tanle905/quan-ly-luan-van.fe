import { TableConfig } from "./interface/table-config.interface";

export const teacherListConfig: TableConfig = {
  apiEndpoint: "",
  title: "Danh sách giảng viên",
  search: true,
  extraComponent: [],
  table: {
    columns: [
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
      },
    ],
  },
};
