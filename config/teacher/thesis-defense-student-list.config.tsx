import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Radio, RadioChangeEvent, Tag, Tooltip } from "antd";
import { cloneDeep } from "lodash";
import {} from "../../components/atoms/action/teacher-table-action.atom";
import { STUDENT_ENDPOINT } from "../../constants/endpoints";
import { ThesisStatus } from "../../constants/enums";
import { TableConfig } from "../interface/table-config.interface";

export const thesisDefenseStudentListConfig: (
  handleSubmit: () => void,
  handleSetStatus: (e: RadioChangeEvent, index: number) => void,
  selectedRowKeys: React.Key[],
  disabled?: boolean | undefined
) => TableConfig = (
  handleSubmit,
  handleSetStatus,
  selectedRowKeys,
  disabled
) => {
  return {
    apiEndpoint: STUDENT_ENDPOINT.BASE,
    search: true,
    extraRightComponent: [
      () => {
        return (
          <Tooltip
            title={
              disabled
                ? "Bạn đã nộp danh sách báo cáo"
                : "Nộp danh sách báo cáo"
            }
          >
            <Button
              disabled={disabled}
              type="primary"
              onClick={() =>
                Modal.confirm({
                  icon: null,
                  closable: true,
                  title: "Nộp danh sách",
                  mask: true,
                  maskClosable: true,
                  content:
                    "Bạn có muốn nộp danh sách không ? Mỗi giảng viên chỉ được thực hiện thao tác này 1 lần.",
                  onOk: handleSubmit,
                })
              }
            >
              <UploadOutlined />
              Nộp Danh sách
            </Button>
          </Tooltip>
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
          render: (topic: any, row: any) => {
            return topic.majorTag.map((tag: any, index: number) => (
              <Tag key={index}>{tag.value}</Tag>
            ));
          },
        },
        {
          key: "status",
          width: "20%",
          title: "Trạng thái",
          render: (text, student: any, index) => (
            <Radio.Group
              className="flex justify-between"
              onChange={(e: RadioChangeEvent) => handleSetStatus(e, index)}
              defaultValue="isReadyForThesisDefense"
              disabled={!selectedRowKeys.includes(index)}
            >
              <Radio value={ThesisStatus.IsReadyForThesisDefense}>
                Được báo cáo
              </Radio>
              <Radio value={ThesisStatus.IsMarkedForIncomplete}>
                Cho điểm I
              </Radio>
            </Radio.Group>
          ),
        },
      ],
      transform(data) {
        const clonedData = cloneDeep(data);
        clonedData.status = ThesisStatus.IsReadyForThesisDefense;

        return clonedData;
      },
    },
  };
};
