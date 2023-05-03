import { TableConfig } from "../interface/table-config.interface";
import {
  TAG_ENDPOINT,
  TEACHER_MANAGEMENT_ENDPOINT,
  baseURL,
} from "../../constants/endpoints";
import { Button, Form, Input, Modal, Tag } from "antd";
import { AtomTeacherManagementTableAction } from "../../components/atoms/action/teacher-management-table-action.atom";
import { MCAddUserFormModal } from "../../components/molecules/modal/add-user-form-modal.molecule";
import { Roles } from "../../constants/enums";
import { useState } from "react";
import axios from "axios";

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
    () => <AddTagModal />,
  ],
  table: {
    pageSize: 10,
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

function AddTagModal() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  async function handleAddModal() {
    if (!form.getFieldValue("value")) return;

    await axios.post(baseURL + TAG_ENDPOINT.BASE + TAG_ENDPOINT.MAJOR_TAGS, {
      value: form.getFieldValue("value"),
    });
    form.resetFields();
    setOpen(false);
  }

  return (
    <>
      <Modal
        title="Thêm tag"
        destroyOnClose
        closable
        open={open}
        onOk={handleAddModal}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
      >
        <Form form={form}>
          <Form.Item label="Tên Tag" name={"value"}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Button type="primary" onClick={() => setOpen(true)}>
        Thêm tag
      </Button>
    </>
  );
}
