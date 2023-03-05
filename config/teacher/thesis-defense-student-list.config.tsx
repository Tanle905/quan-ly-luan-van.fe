import { UploadOutlined } from "@ant-design/icons";
import { Button, Radio, RadioChangeEvent, Tag } from "antd";
import {} from "../../components/atoms/action/teacher-table-action.atom";
import { STUDENT_ENDPOINT } from "../../constants/endpoints";
import { TableConfig } from "../interface/table-config.interface";

export const thesisDefenseStudentListConfig: (
  handleSubmit: () => void,
  handleSetStatus: (e: RadioChangeEvent, index: number) => void
) => TableConfig = (handleSubmit, handleSetStatus) => {
  return {
    apiEndpoint: STUDENT_ENDPOINT.BASE,
    title: "Quản lý danh sách sinh viên báo cáo",
    search: true,
    extraRightComponent: [
      () => {
        return (
          <Button type="primary" onClick={() => handleSubmit()}>
            <UploadOutlined />
            Nộp Danh sách
          </Button>
        );
      },
    ],
    table: {
      columns: [
        {
          key: "MSSV",
          title: "MSSV",
          dataIndex: "MSSV",
          width: "7%",
          sorter: true,
        },
        {
          key: "name",
          title: "Họ và Tên",
          dataIndex: "firstName",
          sorter: true,
          width: "15%",
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
          ellipsis: true,
          sorter: true,
        },
        {
          key: "major",
          title: "Chuyên ngành",
          dataIndex: "major",
          width: "10%",
          sorter: true,
        },
        {
          key: "topicName",
          title: "Tên đề tài",
          dataIndex: "topic",
          width: "10%",
          ellipsis: true,
          sorter: true,
          render: (value, record, index) => {
            return value.topicName;
          },
        },
        {
          key: "majorTag",
          title: "Chủ đề đề tài",
          dataIndex: "topic",
          width: "10%",
          render: (value, record, index) => {
            return <Tag>{value.majorTag}</Tag>;
          },
        },
        {
          key: "isReadyForThesisDefense",
          width: "20%",
          title: "Trạng thái",
          render: (text, student: any, index) => (
            <Radio.Group
              className="flex justify-between"
              onChange={(e: RadioChangeEvent) => handleSetStatus(e, index)}
              defaultValue="isReadyForThesisDefense"
            >
              <Radio value="isReadyForThesisDefense">Được báo cáo</Radio>
              <Radio value="isMarkedForIncomplete">Cho điểm I</Radio>
            </Radio.Group>
          ),
        },
      ],
    },
  };
};
