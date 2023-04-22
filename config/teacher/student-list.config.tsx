import { Tag } from "antd";
import { AtomStudentTableAction } from "../../components/atoms/action/student-table-action.atom";
import {} from "../../components/atoms/action/teacher-table-action.atom";
import { STUDENT_ENDPOINT } from "../../constants/endpoints";
import { TableConfig } from "../interface/table-config.interface";
import { handleRenderStudentStatus } from "../../utils/format.util";
import { ThesisStatus } from "../../constants/enums";

export const studentListConfig: TableConfig = {
  apiEndpoint: STUDENT_ENDPOINT.BASE,
  title: "Quản lý sinh viên",
  search: true,
  filter: [
    {
      key: "status",
      label: "Trạng thái",
      data: [
        { label: "Tất cả", value: "" },
        { label: "Giảng viên chưa nộp danh sách", value: null },
        { label: "Nhận điểm I", value: ThesisStatus.IsMarkedForIncomplete },
        {
          label: "Chưa có lịch báo cáo",
          value: ThesisStatus.IsReadyForThesisDefense,
        },
        {
          label: "Đã có lịch báo cáo",
          value: ThesisStatus.IsHadThesisDefenseSchedule,
        },
      ],
    },
  ],
  table: {
    columns: [
      {
        key: "MSSV",
        title: "MSSV",
        dataIndex: "MSSV",
        sorter: true,
      },
      {
        key: "name",
        title: "Họ và Tên",
        dataIndex: "firstName",
        sorter: true,

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
        sorter: true,
      },
      {
        key: "major",
        title: "Chuyên ngành",
        dataIndex: "major",
        sorter: true,
      },
      {
        key: "topicName",
        title: "Tên đề tài",
        dataIndex: "topic",
        sorter: true,
        render: (value, record, index) => {
          return value.topicName;
        },
      },
      {
        key: "majorTag",
        title: "Chủ đề đề tài",
        dataIndex: "topic",
        render: (topic: any, row: any) => {
          return topic.majorTag.map((tag: any, index: number) => (
            <Tag key={index}>{tag.value}</Tag>
          ));
        },
      },
      {
        key: "status",
        title: "Trạng thái",
        dataIndex: "status",
        sorter: true,
        render: (status: any, row: any) => {
          return handleRenderStudentStatus(status);
        },
      },
      {
        key: "action",
        width: "10%",
        title: "Hành động",
        render: (text, student: any) => (
          <AtomStudentTableAction student={student} />
        ),
      },
    ],
  },
};
