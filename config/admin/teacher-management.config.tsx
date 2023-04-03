import { TableConfig } from "../interface/table-config.interface";
import { TEACHER_MANAGEMENT_ENDPOINT } from "../../constants/endpoints";
import { Button, Tag } from "antd";
import { AtomTeacherManagementTableAction } from "../../components/atoms/action/teacher-management-table-action.atom";
import { MCAddUserFormModal } from "../../components/molecules/modal/add-user-form-modal.molecule";
import { Roles } from "../../constants/enums";

export const teacherManagementListConfig: TableConfig = {
  apiEndpoint: TEACHER_MANAGEMENT_ENDPOINT.BASE,
  search: true,
  extraRightComponent: [
    (props) => (
      <MCAddUserFormModal
        title="Thêm giảng viên"
        role={Roles.TEACHER}
        endpoint={TEACHER_MANAGEMENT_ENDPOINT.BASE}
        triggerElement={(openModal) => (
          <Button onClick={openModal} type="primary">
            Thêm giảng viên
          </Button>
        )}
      />
    ),
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
        dataIndex: "firstName",
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
        key: "majorTags",
        title: "Chuyên ngành",
        dataIndex: "majorTags",
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
          <AtomTeacherManagementTableAction teacher={teacher} />
        ),
      },
    ],
  },
};
