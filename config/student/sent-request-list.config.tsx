import { TableConfig } from "../interface/table-config.interface";
import { REQUEST_ENDPOINT } from "../../constants/endpoints";
import { AtomSentRequestTableAction } from "../../components/atoms/action/sent-request-table-action.atom";
import { Divider, Layout, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { TopicStatus } from "../../constants/enums";

export const sentRequestListConfig: TableConfig = {
  apiEndpoint: REQUEST_ENDPOINT.BASE,
  search: true,
  table: {
    columns: [
      {
        key: "MSCB",
        title: "MSCB",
        dataIndex: "MSCB",
        render: (value, record: any) => record.teacher.MSCB,
      },
      {
        key: "name",
        title: "Họ và Tên",
        dataIndex: "firstName",
        sorter: true,
        render: (value, record: any) =>
          `${record.teacher.lastName} ${record.teacher.firstName}`,
      },
      {
        key: "email",
        title: "Email",
        dataIndex: "email",
        sorter: true,
        render: (value, record: any) => record.teacher.email,
      },
      {
        key: "major",
        title: "Chuyên ngành",
        dataIndex: "majorTags",
        render: (majorTags: any, record: any) => {
          return record.teacher.majorTags?.map((tag: string, index: number) => (
            <Tag key={index}>{tag}</Tag>
          ));
        },
      },
      {
        key: "createdAt",
        title: "Ngày gửi",
        dataIndex: "createdAt",
        render: (date: any, record: any) => {
          return (
            <Typography.Text>{dayjs(date).format("LLLL A")}</Typography.Text>
          );
        },
      },
      {
        key: "topic",
        title: "Đề tài",
        dataIndex: "topic",
        render: (topic: any, record: any) => {
          return <Typography.Text>{topic.topicName}</Typography.Text>;
        },
      },
      {
        key: "topicStatus",
        title: "Trạng thái đề tài",
        dataIndex: "topic",
        render: (topic: any, record: any) => {
          return (
            <Typography.Text>
              {handleRenderTopicStatus(topic?.topicStatus)}
            </Typography.Text>
          );
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
              <Divider type="vertical" />
              <Typography.Text>
                Giảng viên{" "}
                {record.isTeacherAccepted ? (
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
          <AtomSentRequestTableAction request={request} />
        ),
      },
    ],
  },
};

function handleRenderTopicStatus(status: string | null) {
  let statusText = "";

  switch (status) {
    case null:
      statusText = "Tạo chủ đề";
      break;
    case TopicStatus.Pending:
      statusText = "Chờ duyệt";
      break;
    case TopicStatus.RequestChange:
      statusText = "Yêu cầu chỉnh sửa";
      break;
    case TopicStatus.Accepted:
      statusText = "Đã duyệt";
      break;
    default:
      status = "";
      break;
  }

  return statusText;
}
