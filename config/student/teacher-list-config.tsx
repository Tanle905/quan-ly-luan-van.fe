import { TableConfig } from "../interface/table-config.interface";
import { AtomTeacherTableAction } from "../../components/atoms/action/teacher-table-action.atom";
import { Tag } from "antd";
import { TAG_ENDPOINT } from "../../constants/endpoints";
import { MajorTag } from "../../components/molecules/form/profile-form.molecule";

export const teacherListConfig: TableConfig = {
  apiEndpoint: "",
  title: "Danh sách giảng viên",
  search: true,
  filter: [
    {
      key: "majorTags",
      label: "Chủ đề",
      endpoint: TAG_ENDPOINT.BASE + TAG_ENDPOINT.MAJOR_TAGS,
      selectProps: { mode: "multiple", showArrow: true, tagRender: MajorTag },
    },
  ],
  table: {
    columns: [
      {
        key: "MSCB",
        title: "MSCB",
        dataIndex: "MSCB",
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
        sorter: true,
        dataIndex: "email",
      },
      {
        key: "major",
        title: "Chuyên ngành",
        dataIndex: "major",
        sorter: true,
        render: (major) => major,
      },
      {
        key: "majorTags",
        title: "Chủ đề",
        dataIndex: "majorTags",
        sorter: true,
        render: (majorTags: any, row: any) => {
          return majorTags.map((tag: string, index: number) => (
            <Tag key={index}>{tag}</Tag>
          ));
        },
      },
      {
        key: "action",
        width: "10%",
        title: "Hành động",
        render: (text, teacher: any) => (
          <AtomTeacherTableAction teacher={teacher} />
        ),
      },
    ],
  },
};
