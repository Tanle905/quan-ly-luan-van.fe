import { TableConfig } from "../interface/table-config.interface";
import { REQUEST_ENDPOINT } from "../../constants/endpoints";
import { AtomSentRequestTableAction } from "../../components/atoms/action/sent-request-table-action.atom";
import { AtomReceivedRequestTableAction } from "../../components/atoms/action/received-request-table-action.atom";

export const receivedRequestListConfig: TableConfig = {
  apiEndpoint: REQUEST_ENDPOINT.BASE,
  search: true,
  table: {
    columns: [
      {
        key: "MSSV",
        title: "MSSV",
        dataIndex: "MSSV",
        render: (value, record: any) => record.student.MSSV,
      },
      {
        key: "name",
        title: "Họ và Tên",
        dataIndex: "firstName",
        sorter: true,
        render: (value, record: any) =>
          `${record.student.lastName} ${record.student.firstName}`,
      },
      {
        key: "email",
        title: "Email",
        dataIndex: "email",
        width: "20%",
        sorter: true,
        render: (value, record: any) => record.student.email,
      },
      {
        key: "major",
        title: "Chuyên ngành",
        dataIndex: "majorTags",
        render: (majorTags: any, record: any) => {
          return record.student.major;
        },
      },
      {
        key: "topic",
        title: "Đề tài",
        dataIndex: "topic",
        render: (topic: any, record: any) => {
          return topic.topicName;
        },
      },
      {
        key: "action",
        width: "10%",
        title: "Hành động",
        render: (text, request: any) => (
          <AtomReceivedRequestTableAction request={request} />
        ),
      },
    ],
  },
};
