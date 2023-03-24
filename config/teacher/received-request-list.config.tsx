import { TableConfig } from "../interface/table-config.interface";
import { REQUEST_ENDPOINT } from "../../constants/endpoints";
import { AtomReceivedRequestTableAction } from "../../components/atoms/action/received-request-table-action.atom";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Layout, Typography } from "antd";
import { handleRenderTopicStatus } from "../../utils/format.util";

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
        key: "topic",
        title: "Trạng thái đề tài",
        dataIndex: "topic",
        render: (topic: any, record: any) => {
          return handleRenderTopicStatus(topic?.topicStatus);
        },
      },
      {
        key: "requestStatus",
        title: "Trạng thái yêu cầu",
        render: (date: any, record: any) => {
          return (
            <Layout.Content className="flex items-center">
              <Typography.Text>
                Sinh viên{" "}
                {record.isStudentAccepted ? (
                  <CheckOutlined className="text-green-600" />
                ) : (
                  <CloseOutlined className="text-red-600" />
                )}
              </Typography.Text>
            </Layout.Content>
          );
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
