import {} from "../../components/atoms/action/teacher-table-action.atom";
import { TableConfig } from "../interface/table-config.interface";

export const studentListConfig: TableConfig = {
  apiEndpoint: "",
  table: {
    columns: [
      {
        key: "MSSV",
        title: "MSSV",
        dataIndex: "MSSV",
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
        key: "action",
        width: "10%",
        title: "Hành động",
      },
    ],
  },
};
