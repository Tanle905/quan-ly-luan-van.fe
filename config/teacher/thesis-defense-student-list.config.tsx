import { Radio, RadioChangeEvent, Tag } from "antd";
import { cloneDeep } from "lodash";
import {} from "../../components/atoms/action/teacher-table-action.atom";
import { STUDENT_ENDPOINT } from "../../constants/endpoints";
import { ThesisStatus } from "../../constants/enums";
import { TableConfig } from "../interface/table-config.interface";

export const thesisDefenseStudentListConfig: (
  handleSetStatus: (e: RadioChangeEvent, index: number) => void,
  selectedRowKeys: React.Key[]
) => TableConfig = (handleSetStatus, selectedRowKeys) => {
  return {
    apiEndpoint: STUDENT_ENDPOINT.BASE,
    search: true,
    query: `?status=${null}`,
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
