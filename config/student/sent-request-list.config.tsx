import { TableConfig } from "../interface/table-config.interface";
import { REQUEST_ENDPOINT } from "../../constants/endpoints";
import { TAG_ENDPOINT } from "../../constants/endpoints";
import { MajorTag } from "../../components/molecules/form/profile-form.molecule";
import { AtomSentRequestTableAction } from "../../components/atoms/action/sent-request-table-action.atom";
import { Tag } from "antd";

export const sentRequestListConfig: TableConfig = {
  apiEndpoint: REQUEST_ENDPOINT.BASE,
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
