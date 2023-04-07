import { TableConfig } from "../interface/table-config.interface";
import { TOPIC_MANAGEMENT_ENDPOINT } from "../../constants/endpoints";
import { Tag, Typography } from "antd";
import { handleRenderTopicStatus } from "../../utils/format.util";
import { DownloadOutlined } from "@ant-design/icons";

export const topicManagementListConfig: TableConfig = {
  apiEndpoint: TOPIC_MANAGEMENT_ENDPOINT.BASE,
  search: true,
  table: {
    columns: [
      {
        key: "MSSV",
        title: "MSSV",
        dataIndex: "MSSV",
      },
      {
        key: "MSCB",
        title: "MSCB",
        dataIndex: "MSCB",
      },
      {
        key: "studentName",
        title: "Họ tên sinh viên",
        dataIndex: "studentName",
        render: (text, record: any) => <span>{text}</span>,
      },
      {
        key: "topicName",
        title: "Tên đề tài",
        dataIndex: "topicName",
        render: (text, record: any) => <span>{text}</span>,
      },
      {
        key: "topicEnglishName",
        title: "Tên đề tài (Tiếng Anh)",
        dataIndex: "topicEnglishName",
        render: (text, record: any) => <span>{text}</span>,
      },
      {
        key: "majorTag",
        title: "Chuyên ngành",
        dataIndex: "majorTag",
        render: (majorTag: any, row: any) => {
          return majorTag.map((tag: any, index: number) => (
            <Tag key={index}>{tag.value}</Tag>
          ));
        },
      },
      {
        key: "topicStatus",
        title: "Trạng thái đề tài",
        dataIndex: "topicStatus",
        render: (topicStatus: any, record: any) => {
          return (
            <Typography.Text>
              {handleRenderTopicStatus(topicStatus)}
            </Typography.Text>
          );
        },
      },
      {
        key: "action",
        title: "Tải xuống báo cáo",
        width: "13%",
        dataIndex: "fileList",
        render: (fileList: any, record: any) => {
          return fileList[0] ? (
            <DownloadOutlined
              onClick={() => downloadURI(fileList[0], "report")}
            />
          ) : (
            "Chưa có file"
          );
        },
      },
    ],
  },
};

function downloadURI(uri: string, name: string) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
